/**
 * This file was generated from TcPaypalButtons.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export type FlowStatusEnumDocEnum = "VAL_PENDING" | "VAL_SUCCESS" | "VAL_ERROR" | "CREATION_PENDING" | "CREATION_SUCCESS" | "CREATION_ERROR" | "APPROVED_PENDING" | "APPROVED_SUCCESS" | "APPROVED_RESTART" | "APPROVED_ERROR";

export interface TcPaypalButtonsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    clientId: DynamicValue<string>;
    orderId: EditableValue<string>;
    flowStatus: EditableValue<string>;
    flowStatusEnumDoc: FlowStatusEnumDocEnum;
    onCreateOrder?: ActionValue;
    onApproved?: ActionValue;
    onClick?: ActionValue;
    onCancel?: ActionValue;
}

export interface TcPaypalButtonsPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    clientId: string;
    orderId: string;
    flowStatus: string;
    flowStatusEnumDoc: FlowStatusEnumDocEnum;
    onCreateOrder: {} | null;
    onApproved: {} | null;
    onClick: {} | null;
    onCancel: {} | null;
}
