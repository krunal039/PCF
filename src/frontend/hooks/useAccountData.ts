import { useState, useEffect, useCallback, useMemo } from "react";
/// <reference types="powerapps-component-framework" />
import { DataverseService } from "../../services/DataverseService";
import { DataverseRecord } from "../../models/DataverseModels";
import { ErrorHandler } from "../../core";

export interface UseAccountDataResult {
  account: DataverseRecord | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage account entity data
 * @param context - PCF context
 * @param accountId - Account record ID (from lookup field)
 * @returns Account data, loading state, error, and refresh function
 */
export const useAccountData = (
  context: ComponentFramework.Context<any>,
  accountId: string | null | undefined
): UseAccountDataResult => {
  const [account, setAccount] = useState<DataverseRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dataverseService = useMemo(
    () => new DataverseService(context),
    [context]
  );

  const fetchAccount = useCallback(async () => {
    if (!accountId) {
      setAccount(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch account with common fields
      const accountData = await dataverseService.fetchRecord(
        "accounts",
        accountId,
        [
          "accountid",
          "name",
          "emailaddress1",
          "telephone1",
          "websiteurl",
          "address1_line1",
          "address1_city",
          "address1_stateorprovince",
          "address1_postalcode",
          "address1_country",
          "description",
          "revenue",
          "numberofemployees",
          "industrycode",
          "accountratingcode",
          "statecode",
          "statuscode",
        ]
      );

      setAccount(accountData);
    } catch (err: any) {
      const errorMessage = ErrorHandler.getUserMessage(err, {
        service: "useAccountData",
        operation: "fetchAccount",
        entity: "accounts",
        recordId: accountId,
      });
      setError(errorMessage);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, [dataverseService, accountId]);

  // Auto-fetch when accountId changes
  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    account,
    loading,
    error,
    refresh: fetchAccount,
  };
};

