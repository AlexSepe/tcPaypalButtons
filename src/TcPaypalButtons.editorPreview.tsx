import { Component, ReactNode, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { TcPaypalButtonsPreviewProps } from "../typings/TcPaypalButtonsProps";

export class preview extends Component<TcPaypalButtonsPreviewProps> {
    render(): ReactNode {
        return <HelloWorldSample sampleText={"<<PAYPAL>>"} />;
    }
}

export function getPreviewCss(): string {
    return require("./ui/TcPaypalButtons.css");
}
