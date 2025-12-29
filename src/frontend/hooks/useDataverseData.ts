import { useState, useCallback, useMemo } from "react";
/// <reference types="powerapps-component-framework" />
import { DataverseService } from "../../services/DataverseService";
import { DataverseResponse } from "../../models/DataverseModels";
import { ErrorHandler } from "../../core";

export const useDataverseData = (context: ComponentFramework.Context<any>) => {
  const [data, setData] = useState<DataverseResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dataverseService = useMemo(
    () => new DataverseService(context),
    [context]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataverseService.fetchRecords();
      setData(result);
    } catch (err: any) {
      const errorMessage = ErrorHandler.getUserMessage(err, {
        service: "useDataverseData",
        operation: "fetchData",
      });

      // Provide more helpful error message for test harness limitation
      let displayError = errorMessage;
      if (
        err?.message?.includes("retrieveMultipleRecords") ||
        err?.message?.includes("not yet supported")
      ) {
        displayError =
          "retrieveMultipleRecords is not supported in the test harness. " +
          "This feature works in production when triggered by user interaction. " +
          "The control will attempt to fetch the current record instead if available.";
      }

      setError(displayError);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [dataverseService]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};
