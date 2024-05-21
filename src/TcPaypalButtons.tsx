import { Component, ReactNode, createElement } from "react";
import { PayPalButtons, PayPalButtonsComponentProps, PayPalScriptProvider } from "@paypal/react-paypal-js";

import { TcPaypalButtonsContainerProps } from "../typings/TcPaypalButtonsProps";

import "./ui/TcPaypalButtons.css";

enum FlowStatusEnum {
    VAL_PENDING = "VAL_PENDING",
    VAL_SUCCESS = "VAL_SUCCESS",
    VAL_ERROR = "VAL_ERROR",
    CREATION_PENDING = "CREATION_PENDING",
    CREATION_SUCCESS = "CREATION_SUCCESS",
    CREATION_ERROR = "CREATION_ERROR",
    APPROVED_PENDING = "APPROVED_PENDING",
    APPROVED_SUCCESS = "APPROVED_SUCCESS",
    APPROVED_RESTART = "APPROVED_RESTART",
    APPROVED_ERROR = "APPROVED_ERROR"
}

export class TcPaypalButtons extends Component<TcPaypalButtonsContainerProps> {
    render(): ReactNode {
        function __delay__(timer: any) {
            return new Promise<void>(resolve => {
                timer = timer || 500;
                setTimeout(function () {
                    resolve();
                }, timer);
            });
        }

        const delay = 200;
        const maxRetries = Math.floor(10000 / delay); //timeout 10 segundos

        //https://developer.paypal.com/sdk/js/reference/#link-createorder
        const onCreateOrder: PayPalButtonsComponentProps["createOrder"] = async (data) => {
            try {
                console.log("tcPaypalButtons.onCreateOrder:: fluxo inicial -> paymentSource:: " + data.paymentSource);

                //reseta campo status e executa callback                
                this.props.flowStatus.setValue(FlowStatusEnum.CREATION_PENDING);
                if (this.props.onCreateOrder) {
                    this.props.onCreateOrder.execute();                   
                } else {
                    throw "Event onCreateOrder is required!!";
                }
                //await mendix to create a paypal order with new orderId
                let flowStatus: String = FlowStatusEnum.CREATION_PENDING;
                let retries = 0;
                console.log("tcPaypalButtons.onCreateOrder:: gerando orderId.");
                while (retries < maxRetries) {
                    flowStatus = this.props.flowStatus.value || flowStatus;
                    if (flowStatus != FlowStatusEnum.CREATION_PENDING && flowStatus != FlowStatusEnum.VAL_SUCCESS) break;
                    console.log("orderId não foi gerado. aguardando " + retries++);
                    await __delay__(delay);
                }
                //testa se o retorno não foi sucesso!
                if (flowStatus != FlowStatusEnum.CREATION_SUCCESS) {
                    throw "tcPaypalButtons.onCreateOrder:: flowStatus is " + flowStatus;
                }
                //testa se retornou um OrderId
                let orderId = this.props.orderId.value || "";
                if (orderId == "") {
                    throw "tcPaypalButtons.onCreateOrder:: orderId is Empty";
                }
                //order Id Obtido...?!
                console.log("tcPaypalButtons.onCreateOrder:: Novo orderId:" + orderId);
                return orderId;
            } catch (error) {
                console.error(error);
                throw error;
            }
        };

        //https://developer.paypal.com/sdk/js/reference/#link-onapprove
        const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
            try {
                console.log("tcPaypalButtons.onApprove:: fluxo inicial -> data:: ", data);

                //reseta campo status e executa callback
                this.props.flowStatus.setValue(FlowStatusEnum.APPROVED_PENDING);
                if (this.props.onApproved) {
                    this.props.onApproved.execute();
                } else {
                    throw "Event onApproved is required!!";
                }                

                //await mendix to approve a paypal order (capture)
                let flowStatus: String = FlowStatusEnum.APPROVED_PENDING;
                let retries = 0;
                console.log("tcPaypalButtons.onApprove:: capturando order.");
                while (retries < maxRetries) {
                    flowStatus = this.props.flowStatus.value || flowStatus;
                    if (flowStatus != FlowStatusEnum.APPROVED_PENDING && flowStatus != FlowStatusEnum.CREATION_SUCCESS) break;
                    console.log("captura não finalizada. aguardando " + retries++);
                    await __delay__(delay);
                }
                //testa se o retorno não foi sucesso!
                if (flowStatus != FlowStatusEnum.APPROVED_SUCCESS) {
                    //caso indicado restarta o processo!...
                    if (flowStatus == FlowStatusEnum.APPROVED_RESTART) {
                        console.log("captura não realizada. restating...");
                        actions.restart();
                        return;
                    }
                    throw "tcPaypalButtons.onApprove:: flowStatus is " + flowStatus + " (waiting for a APPROVED_SUCCESS / APPROVED_RESTART)";
                }
                //order capturada com sucesso...
                console.log("tcPaypalButtons.onApprove:: Sucesso!");
                //actions.redirect();
                return;
            } catch (error) {
                console.error(error);
                throw error;
            }
        };

        //https://developer.paypal.com/sdk/js/reference/#link-oninitonclick
        const onClick: PayPalButtonsComponentProps["onClick"] = async (data, actions) => {
            try {
                console.log("tcPaypalButtons.onClick:: fluxo inicial -> data:: ", data);

                //reseta campo status e executa callback
                this.props.flowStatus.setValue(FlowStatusEnum.VAL_PENDING);                
                if (this.props.onClick) {
                    this.props.onClick.execute();
                } else {
                    console.log("tcPaypalButtons.onClick:: onclick is required!!!!");
                    return actions.reject();                    
                }

                //await mendix to validate a paypal order
                let flowStatus: String = FlowStatusEnum.VAL_PENDING;
                let retries = 0;
                console.log("tcPaypalButtons.onClick:: validando order.");
                while (retries < maxRetries) {
                    flowStatus = this.props.flowStatus.value || flowStatus;
                    if (flowStatus != FlowStatusEnum.VAL_PENDING) break;
                    console.log("validação não finalizada. aguardando " + retries++);
                    await __delay__(delay);
                }
                //testa se o retorno não foi sucesso!
                if (flowStatus != FlowStatusEnum.VAL_SUCCESS) {
                    console.log("validação não realizada. rejecting...");
                    return actions.reject();
                }
                //order capturada com sucesso...
                console.log("tcPaypalButtons.onClick:: Sucesso!");
                return actions.resolve();
            } catch (error) {
                console.error(error);
                throw error;
            }
        };

        const initialOptions = {
            clientId: this.props.clientId.value || "ERROR", //"AWh_c7yJsJ4I12Io4dp4WDnalb2AQVLyDpeI33-J-7SRC7ANs2o-o2uCLSTClkM_zEBsc2NSTW1JHp9S",
            currency: "BRL",
            intent: "capture"
        };

        const styles: PayPalButtonsComponentProps["style"] = {
            label: "pay"
        };

        return (
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={styles}
                    fundingSource="paypal"                    
                    createOrder={onCreateOrder}
                    onApprove={onApprove}
                    onClick={onClick}
                />
            </PayPalScriptProvider>
        );
    }
}
