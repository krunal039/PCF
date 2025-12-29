/// <reference types="powerapps-component-framework" />
import {
  DataverseResponse,
  DataverseRecord,
  QueryOptions,
  CreateRecordOptions,
  UpdateRecordOptions,
} from "../models/DataverseModels";
import { WebApiService } from "./WebApiService";
import { Logger, ErrorHandler } from "../core";

export class DataverseService {
  private context: ComponentFramework.Context<any>;
  private webApiService: WebApiService;
  private logger: Logger;

  constructor(context: ComponentFramework.Context<any>) {
    this.context = context;
    this.webApiService = new WebApiService(context);
    this.logger = Logger.create("DataverseService");
  }

  /**
   * Fetch records from Dataverse
   * @param entityName - Name of the entity to query
   * @param options - Query options (filter, select, orderby, etc.)
   * @returns Promise with Dataverse response
   */
  async fetchRecords(
    entityName: string = "accounts",
    options?: QueryOptions
  ): Promise<DataverseResponse> {
    try {
      this.logger.info(`Fetching records from entity: ${entityName}`);

      const queryString = this.buildQueryString(options);
      const response = await this.webApiService.retrieveMultipleRecords(
        entityName,
        queryString
      );

      return {
        value: response.value || [],
        "@odata.count": response["@odata.count"],
        "@odata.nextLink": response["@odata.nextLink"],
      };
    } catch (error: any) {
      // Check if this is the "retrieveMultipleRecords not supported" error
      // This can happen in test harness or certain PCF contexts
      const errorMessage = error?.message || String(error);
      if (
        errorMessage.includes("retrieve multiple records") ||
        errorMessage.includes("not yet supported")
      ) {
        // Try fallback: get current record if available
        const recordId = this.getCurrentRecordId();
        const entityTypeName = this.getEntityTypeName();

        if (recordId && entityTypeName) {
          this.logger.info(
            `Fallback: Fetching single record ${recordId} from ${entityTypeName}`
          );
          try {
            const record = await this.fetchRecord(
              entityTypeName,
              recordId,
              options?.select
            );
            return {
              value: [record],
              "@odata.count": 1,
            };
          } catch (fallbackError) {
            this.logger.error(
              "Fallback fetchRecord also failed",
              fallbackError
            );
          }
        }

        // If fallback didn't work, throw a more helpful error
        throw new Error(
          "retrieveMultipleRecords is not supported in this context. " +
            "This may be a test harness limitation. " +
            (recordId
              ? `Current record ID: ${recordId}`
              : "No current record ID available.")
        );
      }

      const errorInfo = ErrorHandler.parse(error, {
        service: "DataverseService",
        operation: "fetchRecords",
        entity: entityName,
      });
      this.logger.error("Error fetching records", error, errorInfo.context);
      throw error;
    }
  }

  /**
   * Get current record ID from context (if available)
   */
  private getCurrentRecordId(): string | null {
    try {
      // In model-driven apps, get record ID from page context
      const pageContext = (this.context as any).page;
      if (pageContext?.entityId) {
        return pageContext.entityId;
      }

      // Alternative: check if there's a record ID in the context
      const recordId = (this.context as any).page?.entityId;
      return recordId || null;
    } catch {
      return null;
    }
  }

  /**
   * Get entity type name from context (if available)
   */
  private getEntityTypeName(): string | null {
    try {
      const pageContext = (this.context as any).page;
      if (pageContext?.entityTypeName) {
        return pageContext.entityTypeName;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch a single record by ID
   * @param entityName - Name of the entity
   * @param recordId - ID of the record
   * @param select - Fields to select
   * @returns Promise with the record
   */
  async fetchRecord(
    entityName: string,
    recordId: string,
    select?: string[],
    _options?: QueryOptions
  ): Promise<DataverseRecord> {
    try {
      this.logger.info(
        `Fetching record ${recordId} from entity: ${entityName}`
      );

      const selectFields = select ? select.join(",") : undefined;
      const record = await this.webApiService.retrieveRecord(
        entityName,
        recordId,
        selectFields
      );

      return record;
    } catch (error) {
      const errorInfo = ErrorHandler.parse(error, {
        service: "DataverseService",
        operation: "fetchRecord",
        entity: entityName,
        recordId,
      });
      this.logger.error("Error fetching record", error, errorInfo.context);
      throw error;
    }
  }

  /**
   * Create a new record in Dataverse
   * @param entityName - Name of the entity
   * @param data - Record data
   * @param options - Additional options
   * @returns Promise with the created record ID
   */
  async createRecord(
    entityName: string,
    data: Record<string, any>,
    options?: CreateRecordOptions
  ): Promise<string> {
    try {
      this.logger.info(`Creating record in entity: ${entityName}`);

      const recordId = await this.webApiService.createRecord(
        entityName,
        data,
        options
      );

      this.logger.info(`Record created with ID: ${recordId}`);
      return recordId;
    } catch (error) {
      const errorInfo = ErrorHandler.parse(error, {
        service: "DataverseService",
        operation: "createRecord",
        entity: entityName,
      });
      this.logger.error("Error creating record", error, errorInfo.context);
      throw error;
    }
  }

  /**
   * Update an existing record in Dataverse
   * @param entityName - Name of the entity
   * @param recordId - ID of the record to update
   * @param data - Updated record data
   * @param options - Additional options
   */
  async updateRecord(
    entityName: string,
    recordId: string,
    data: Record<string, any>,
    options?: UpdateRecordOptions
  ): Promise<void> {
    try {
      this.logger.info(`Updating record ${recordId} in entity: ${entityName}`);

      await this.webApiService.updateRecord(entityName, recordId, data);

      this.logger.info(`Record ${recordId} updated successfully`);
    } catch (error) {
      const errorInfo = ErrorHandler.parse(error, {
        service: "DataverseService",
        operation: "updateRecord",
        entity: entityName,
        recordId,
      });
      this.logger.error("Error updating record", error, errorInfo.context);
      throw error;
    }
  }

  /**
   * Delete a record from Dataverse
   * @param entityName - Name of the entity
   * @param recordId - ID of the record to delete
   */
  async deleteRecord(entityName: string, recordId: string): Promise<void> {
    try {
      this.logger.info(
        `Deleting record ${recordId} from entity: ${entityName}`
      );

      await this.webApiService.deleteRecord(entityName, recordId);

      this.logger.info(`Record ${recordId} deleted successfully`);
    } catch (error) {
      const errorInfo = ErrorHandler.parse(error, {
        service: "DataverseService",
        operation: "deleteRecord",
        entity: entityName,
        recordId,
      });
      this.logger.error("Error deleting record", error, errorInfo.context);
      throw error;
    }
  }

  /**
   * Execute a Web API action
   * @param actionName - Name of the action
   * @param parameters - Action parameters
   * @returns Promise with the action result
   */
  async executeAction(
    actionName: string,
    parameters?: Record<string, any>
  ): Promise<any> {
    try {
      this.logger.info(`Executing action: ${actionName}`);

      const result = await this.webApiService.executeAction(
        actionName,
        parameters
      );

      return result;
    } catch (error) {
      const errorInfo = ErrorHandler.parse(error, {
        service: "DataverseService",
        operation: "executeAction",
        entity: actionName,
      });
      this.logger.error("Error executing action", error, errorInfo.context);
      throw error;
    }
  }

  /**
   * Build OData query string from options
   * @param options - Query options
   * @returns OData query string
   */
  private buildQueryString(options?: QueryOptions): string {
    if (!options) return "";

    const queryParams: string[] = [];

    if (options.select && options.select.length > 0) {
      queryParams.push(`$select=${options.select.join(",")}`);
    }

    if (options.filter) {
      queryParams.push(`$filter=${encodeURIComponent(options.filter)}`);
    }

    if (options.orderby) {
      queryParams.push(`$orderby=${options.orderby}`);
    }

    if (options.top) {
      queryParams.push(`$top=${options.top}`);
    }

    if (options.skip) {
      queryParams.push(`$skip=${options.skip}`);
    }

    if (options.expand) {
      queryParams.push(`$expand=${options.expand.join(",")}`);
    }

    if (options.count !== undefined) {
      queryParams.push(`$count=${options.count}`);
    }

    return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  }
}
