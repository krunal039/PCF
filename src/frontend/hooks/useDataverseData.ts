import { useState, useEffect, useCallback } from "react";
/// <reference types="powerapps-component-framework" />
import { DataverseService } from "../../services/DataverseService";
import { DataverseResponse } from "../../models/DataverseModels";
import { ErrorHandler } from "../../core";

export const useDataverseData = (context: ComponentFramework.Context<any>) => {
  const [data, setData] = useState<DataverseResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dataverseService = new DataverseService(context);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataverseService.fetchRecords();
      setData(result);
    } catch (err) {
      const errorMessage = ErrorHandler.getUserMessage(err, {
        service: "useDataverseData",
        operation: "fetchData",
      });
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};
