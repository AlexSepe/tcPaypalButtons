import { Component, ReactNode, createElement } from "react";
import { PayPalButtons, PayPalButtonsComponentProps, PayPalScriptProvider } from "@paypal/react-paypal-js";

import { TcPaypalButtonsContainerProps } from "../typings/TcPaypalButtonsProps";

import "./ui/TcPaypalButtons.css";

export class TcPaypalButtons extends Component<TcPaypalButtonsContainerProps> {
    render(): ReactNode {
        function __delay__(timer: any) {
            return new Promise<void>((resolve) => {
                timer = timer || 500;
                setTimeout(function () {
                    resolve();
                }, timer);
            });
        };

        const onCreateOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
            try {
                this.props.orderId.setValue("");
                if (this.props.onCreateOrder) {
                    this.props.onCreateOrder.execute();
                }
                //todo ...
                let  orderId = "";
                console.log("aguardando id...")
                while (true) {
                    orderId = this.props.orderId.value || "";                    
                    if (orderId !== "") break;
                    console.log("aguardando id...>"+orderId)
                    await __delay__(100);
                }
                console.log("id retornou:: " + orderId);
                return orderId;
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
                <PayPalButtons style={styles} createOrder={onCreateOrder} fundingSource="paypal" />
            </PayPalScriptProvider>
        );
    }
}
