import React from "react";
/// <reference types="powerapps-component-framework" />
import { DataverseRecord } from "../../models/DataverseModels";
import "./AccountDisplay.css";

export interface AccountDisplayProps {
  account: DataverseRecord | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export const AccountDisplay: React.FC<AccountDisplayProps> = ({
  account,
  loading,
  error,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="account-display">
        <div className="account-loading">Loading account details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-display">
        <div className="account-error">
          <div className="error-title">Error loading account</div>
          <div className="error-message">{error}</div>
          {onRefresh && (
            <button onClick={onRefresh} className="retry-button">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="account-display">
        <div className="account-empty">
          <p>No account selected.</p>
          <p className="hint">
            Please select an account using the lookup field to display account
            details.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number | null | undefined): string => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US").format(value);
  };

  const getStatusLabel = (statecode: number | undefined): string => {
    if (statecode === 0) return "Active";
    if (statecode === 1) return "Inactive";
    return "Unknown";
  };

  return (
    <div className="account-display">
      <div className="account-header">
        <h3 className="account-name">{account.name || "Unnamed Account"}</h3>
        {onRefresh && (
          <button onClick={onRefresh} className="refresh-button" title="Refresh">
            Refresh
          </button>
        )}
      </div>

      <div className="account-content">
        <div className="account-section">
          <h4 className="section-title">Contact Information</h4>
          <div className="account-details">
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                {account.emailaddress1 ? (
                  <a
                    href={`mailto:${account.emailaddress1}`}
                    className="email-link"
                  >
                    {account.emailaddress1}
                  </a>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">
                {account.telephone1 || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Website:</span>
              <span className="detail-value">
                {account.websiteurl ? (
                  <a
                    href={account.websiteurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    {account.websiteurl}
                  </a>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="account-section">
          <h4 className="section-title">Address</h4>
          <div className="account-details">
            <div className="detail-row">
              <span className="detail-label">Street:</span>
              <span className="detail-value">
                {account.address1_line1 || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">City:</span>
              <span className="detail-value">
                {account.address1_city || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">State/Province:</span>
              <span className="detail-value">
                {account.address1_stateorprovince || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Postal Code:</span>
              <span className="detail-value">
                {account.address1_postalcode || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Country:</span>
              <span className="detail-value">
                {account.address1_country || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="account-section">
          <h4 className="section-title">Business Information</h4>
          <div className="account-details">
            <div className="detail-row">
              <span className="detail-label">Revenue:</span>
              <span className="detail-value">
                {formatCurrency(account.revenue)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Employees:</span>
              <span className="detail-value">
                {formatNumber(account.numberofemployees)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Industry:</span>
              <span className="detail-value">
                {account.industrycode ? `Code: ${account.industrycode}` : "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rating:</span>
              <span className="detail-value">
                {account.accountratingcode
                  ? `Code: ${account.accountratingcode}`
                  : "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                {getStatusLabel(account.statecode)}
              </span>
            </div>
          </div>
        </div>

        {account.description && (
          <div className="account-section">
            <h4 className="section-title">Description</h4>
            <div className="account-description">{account.description}</div>
          </div>
        )}

        <div className="account-footer">
          <div className="account-id">
            Account ID: {account.accountid}
          </div>
        </div>
      </div>
    </div>
  );
};

