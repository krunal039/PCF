import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { ComponentFramework } from "powerapps-component-framework";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "../../src/frontend/App";

export class PASDetailsPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _props: any;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        
        // Prepare props for React component
        this._props = {
            context: context,
            sampleProperty: context.parameters.sampleProperty.raw,
            onUpdate: this._notifyOutputChanged.bind(this)
        };

        // Render React component
        ReactDOM.render(
            React.createElement(App, this._props),
            this._container
        );
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this._container);
    }
}


