/// <reference types="powerapps-component-framework" />
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { App, AppProps } from "../../src/frontend/App";

export class PASDetailsPCF
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;
  private _props: AppProps;
  private _root: Root | null = null;

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
      sampleProperty: context.parameters.sampleProperty.raw || undefined,
      onUpdate: this._notifyOutputChanged.bind(this),
    };

    // Render React component using React 18 createRoot
    if (!this._root) {
      this._root = createRoot(this._container);
    }
    this._root.render(React.createElement(App, this._props));
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }
}
