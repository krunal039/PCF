import React, { useState, useEffect } from "react";
/// <reference types="powerapps-component-framework" />
import "./PartialEntryForm.css";

export interface PartialEntryFormProps {
  context: ComponentFramework.Context<any>;
  underwritingType?: number;
  brokerName?: ComponentFramework.LookupValue[];
  inceptionDate?: Date;
  methodOfPlacement?: number;
  brokerCode?: string;
  onFieldChange: (fieldName: string, value: any) => void;
}

export const PartialEntryForm: React.FC<PartialEntryFormProps> = ({
  context,
  underwritingType,
  brokerName,
  inceptionDate,
  methodOfPlacement,
  brokerCode,
  onFieldChange,
}) => {
  // Sample options for dropdowns (in production, these would come from Dataverse optionsets or related entities)
  const underwritingTypeOptions = [
    { value: 1, label: "Direct" },
    { value: 2, label: "Facultative" },
    { value: 3, label: "Treaty" },
    { value: 4, label: "Excess of Loss" },
  ];

  const methodOfPlacementOptions = [
    { value: 1, label: "Direct" },
    { value: 2, label: "Broker" },
    { value: 3, label: "Agent" },
    { value: 4, label: "Reinsurance" },
  ];

  const handleUnderwritingTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    onFieldChange("underwritingType", value);
  };

  const handleBrokerNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // In a real implementation, use context.utils.openLookup to open lookup dialog
    // For now, handle the selected value
    const value = e.target.value;
    if (value) {
      onFieldChange("brokerName", [
        {
          id: value,
          name: "",
          entityType: "account",
        },
      ]);
    } else {
      onFieldChange("brokerName", null);
    }
  };

  const handleInceptionDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value ? new Date(e.target.value) : null;
    onFieldChange("inceptionDate", value);
  };

  const handleMethodOfPlacementChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    onFieldChange("methodOfPlacement", value);
  };

  const handleBrokerCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFieldChange("brokerCode", value);
  };

  // Format date for input field
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="partial-entry-form">
      <div className="form-header">
        <h2 className="form-title">Partial entry</h2>
        <p className="form-subtitle">General Record Data</p>
      </div>

      <div className="form-content">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="underwritingType" className="field-label">
              Underwriting Type
            </label>
            <select
              id="underwritingType"
              className="form-select"
              value={
                underwritingType !== undefined && underwritingType !== null
                  ? underwritingType
                  : ""
              }
              onChange={handleUnderwritingTypeChange}
            >
              <option value="">Select Underwriting Type</option>
              {underwritingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="brokerName" className="field-label">
              Broker Name
            </label>
            <select
              id="brokerName"
              className="form-select"
              value={
                brokerName && brokerName.length > 0
                  ? brokerName[0].id?.replace(/[{}]/g, "") || ""
                  : ""
              }
              onChange={handleBrokerNameChange}
            >
              <option value="">Select Broker Name</option>
              {/* In production, populate from Dataverse broker entity */}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="inceptionDate" className="field-label">
              Inception Date
            </label>
            <div className="date-input-wrapper">
              <input
                type="date"
                id="inceptionDate"
                className="form-date"
                value={formatDateForInput(inceptionDate)}
                onChange={handleInceptionDateChange}
                placeholder="Select a date"
              />
              <span className="date-icon">📅</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="methodOfPlacement" className="field-label">
              Method of placement
            </label>
            <select
              id="methodOfPlacement"
              className="form-select"
              value={
                methodOfPlacement !== undefined && methodOfPlacement !== null
                  ? methodOfPlacement
                  : ""
              }
              onChange={handleMethodOfPlacementChange}
            >
              <option value="">Select Method of placement</option>
              {methodOfPlacementOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="brokerCode" className="field-label">
              Broker code
            </label>
            <select
              id="brokerCode"
              className="form-select"
              value={brokerCode || ""}
              onChange={handleBrokerCodeChange}
            >
              <option value="">Select Broker code</option>
              {/* In production, populate from Dataverse broker codes */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
