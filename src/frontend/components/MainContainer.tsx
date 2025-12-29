import React from "react";
/// <reference types="powerapps-component-framework" />
import { useAccountData } from "../hooks/useAccountData";
import { AccountDisplay } from "./AccountDisplay";
import "./MainContainer.css";

export interface MainContainerProps {
  context: ComponentFramework.Context<any>;
  accountLookup?: ComponentFramework.LookupValue[];
  sampleProperty?: string;
  onUpdate?: () => void;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  context,
  accountLookup,
  sampleProperty,
}) => {
  // Get account ID from lookup field
  const accountId =
    accountLookup && accountLookup.length > 0
      ? accountLookup[0].id?.replace(/[{}]/g, "")
      : null;

  const { account, loading, error, refresh } = useAccountData(
    context,
    accountId
  );

  return (
    <div className="main-container">
      <div className="header">
        <h2>Account Details</h2>
        {sampleProperty && (
          <p className="subtitle">Property: {sampleProperty}</p>
        )}
      </div>

      <div className="content">
        <AccountDisplay
          account={account}
          loading={loading}
          error={error}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
};
