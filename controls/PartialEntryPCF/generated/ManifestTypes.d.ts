/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    underwritingType: ComponentFramework.PropertyTypes.OptionSetProperty;
    brokerName: ComponentFramework.PropertyTypes.LookupProperty;
    inceptionDate: ComponentFramework.PropertyTypes.DateTimeProperty;
    methodOfPlacement: ComponentFramework.PropertyTypes.OptionSetProperty;
    brokerCode: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    underwritingType?: number;
    brokerName?: ComponentFramework.LookupValue[];
    inceptionDate?: Date;
    methodOfPlacement?: number;
    brokerCode?: string;
}
