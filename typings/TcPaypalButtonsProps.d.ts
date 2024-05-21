/**
 * This file was generated from TcPaypalButtons.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export interface TcPaypalButtonsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    clientId: DynamicValue<string>;
    orderId: EditableValue<string>;
    onCreateOrder?: ActionValue;
    onApproved?: ActionValue;
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
    onCreateOrder: {} | null;
    onApproved: {} | null;
}
