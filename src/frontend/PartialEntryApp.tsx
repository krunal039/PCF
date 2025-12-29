import React from "react";
/// <reference types="powerapps-component-framework" />
import { PartialEntryForm, PartialEntryFormProps } from "./components/PartialEntryForm";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "../styles/App.css";

export interface PartialEntryAppProps {
  context: ComponentFramework.Context<any>;
  underwritingType?: number;
  brokerName?: ComponentFramework.LookupValue[];
  inceptionDate?: Date;
  methodOfPlacement?: number;
  brokerCode?: string;
  onFieldChange: (fieldName: string, value: any) => void;
}

export const PartialEntryApp: React.FC<PartialEntryAppProps> = ({
  context,
  underwritingType,
  brokerName,
  inceptionDate,
  methodOfPlacement,
  brokerCode,
  onFieldChange,
}) => {
  return (
    <ErrorBoundary>
      <div className="app-container">
        <PartialEntryForm
          context={context}
          underwritingType={underwritingType}
          brokerName={brokerName}
          inceptionDate={inceptionDate}
          methodOfPlacement={methodOfPlacement}
          brokerCode={brokerCode}
          onFieldChange={onFieldChange}
        />
      </div>
    </ErrorBoundary>
  );
};

