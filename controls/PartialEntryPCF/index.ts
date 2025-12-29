/// <reference types="powerapps-component-framework" />
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import {
  PartialEntryApp,
  PartialEntryAppProps,
} from "../../src/frontend/PartialEntryApp";

export class PartialEntryPCF
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;
  private _props: PartialEntryAppProps;
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

    // Safety check: ensure all required parameters exist
    if (!context || !context.parameters) {
      console.error("Invalid context or parameters");
      return;
    }

    // Prepare props for React component with safe property access
    const getOptionSetValue = (param: any): number | undefined => {
      if (!param) return undefined;
      try {
        // OptionSet properties have a raw property that contains the numeric value
        if (param.raw !== undefined && param.raw !== null) {
          return typeof param.raw === "number"
            ? param.raw
            : parseInt(param.raw, 10);
        }
        return undefined;
      } catch {
        return undefined;
      }
    };

    const getLookupValue = (
      param: any
    ): ComponentFramework.LookupValue[] | undefined => {
      if (!param) return undefined;
      try {
        return param.raw && param.raw.length > 0 ? param.raw : undefined;
      } catch {
        return undefined;
      }
    };

    const getDateValue = (param: any): Date | undefined => {
      if (!param || !param.raw) return undefined;
      try {
        return new Date(param.raw);
      } catch {
        return undefined;
      }
    };

    this._props = {
      context: context,
      underwritingType: getOptionSetValue(context.parameters.underwritingType),
      brokerName: getLookupValue(context.parameters.brokerName),
      inceptionDate: getDateValue(context.parameters.inceptionDate),
      methodOfPlacement: getOptionSetValue(
        context.parameters.methodOfPlacement
      ),
      brokerCode: context.parameters.brokerCode?.raw || undefined,
      onFieldChange: (fieldName: string, value: any) => {
        // In PCF, bound fields are updated through the form's save mechanism
        // The control notifies that data has changed, and the form will save it
        // For now, we store the change and notify
        // In a real implementation, you might want to use context.mode.trackContainerResize
        // or handle updates through the form's standard save process

        // Store the updated value (this will be picked up by the form on save)
        const parameters = context.parameters as any;

        try {
          switch (fieldName) {
            case "underwritingType":
              if (parameters.underwritingType) {
                parameters.underwritingType.raw =
                  value !== null && value !== undefined ? value : null;
              }
              break;
            case "brokerName":
              if (parameters.brokerName) {
                if (value === null || value === undefined) {
                  parameters.brokerName.raw = null;
                } else if (Array.isArray(value)) {
                  parameters.brokerName.raw = value;
                } else if (typeof value === "string" && value) {
                  parameters.brokerName.raw = [
                    {
                      id: value,
                      name: "",
                      entityType: "account",
                    },
                  ];
                }
              }
              break;
            case "inceptionDate":
              if (parameters.inceptionDate) {
                parameters.inceptionDate.raw =
                  value !== null && value !== undefined ? value : null;
              }
              break;
            case "methodOfPlacement":
              if (parameters.methodOfPlacement) {
                parameters.methodOfPlacement.raw =
                  value !== null && value !== undefined ? value : null;
              }
              break;
            case "brokerCode":
              if (parameters.brokerCode) {
                parameters.brokerCode.raw =
                  value !== null && value !== undefined ? value || null : null;
              }
              break;
          }
        } catch (error) {
          console.error(`Error updating field ${fieldName}:`, error);
        }

        // Notify that output has changed (triggers form save)
        this._notifyOutputChanged();
      },
    };

    // Render React component using React 18 createRoot
    if (!this._root) {
      this._root = createRoot(this._container);
    }
    this._root.render(React.createElement(PartialEntryApp, this._props));
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
