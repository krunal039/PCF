import { ComponentFramework } from 'powerapps-component-framework';
import { Logger, ErrorHandler } from '../core';

export class WebApiService {
    private context: ComponentFramework.Context<any>;
    private logger: Logger;

    constructor(context: ComponentFramework.Context<any>) {
        this.context = context;
        this.logger = Logger.create('WebApiService');
    }

    /**
     * Retrieve multiple records using Web API
     */
    async retrieveMultipleRecords(
        entitySetName: string,
        queryString?: string
    ): Promise<any> {
        try {
            const requestUrl = `${entitySetName}${queryString || ''}`;
            this.logger.info(`Retrieving multiple records: ${requestUrl}`);

            const response = await this.context.webAPI.retrieveMultipleRecords(
                entitySetName,
                queryString
            );

            return response;
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'WebApiService',
                operation: 'retrieveMultipleRecords',
                entity: entitySetName
            });
            this.logger.error('Error in retrieveMultipleRecords', error, errorInfo.context);
            throw this.handleError(error);
        }
    }

    /**
     * Retrieve a single record using Web API
     */
    async retrieveRecord(
        entitySetName: string,
        recordId: string,
        selectFields?: string
    ): Promise<any> {
        try {
            const queryString = selectFields ? `?$select=${selectFields}` : '';
            this.logger.info(`Retrieving record: ${entitySetName}(${recordId})${queryString}`);

            const response = await this.context.webAPI.retrieveRecord(
                entitySetName,
                recordId,
                selectFields
            );

            return response;
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'WebApiService',
                operation: 'retrieveRecord',
                entity: entitySetName,
                recordId
            });
            this.logger.error('Error in retrieveRecord', error, errorInfo.context);
            throw this.handleError(error);
        }
    }

    /**
     * Create a record using Web API
     */
    async createRecord(
        entitySetName: string,
        data: Record<string, any>,
        options?: { returnEntity?: boolean }
    ): Promise<string> {
        try {
            this.logger.info(`Creating record in: ${entitySetName}`);

            const response = await this.context.webAPI.createRecord(
                entitySetName,
                data,
                options
            );

            // Extract record ID from response
            const recordId = response?.id || response;
            return recordId;
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'WebApiService',
                operation: 'createRecord',
                entity: entitySetName
            });
            this.logger.error('Error in createRecord', error, errorInfo.context);
            throw this.handleError(error);
        }
    }

    /**
     * Update a record using Web API
     */
    async updateRecord(
        entitySetName: string,
        recordId: string,
        data: Record<string, any>,
        options?: { returnEntity?: boolean }
    ): Promise<void> {
        try {
            this.logger.info(`Updating record: ${entitySetName}(${recordId})`);

            await this.context.webAPI.updateRecord(
                entitySetName,
                recordId,
                data,
                options
            );
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'WebApiService',
                operation: 'updateRecord',
                entity: entitySetName,
                recordId
            });
            this.logger.error('Error in updateRecord', error, errorInfo.context);
            throw this.handleError(error);
        }
    }

    /**
     * Delete a record using Web API
     */
    async deleteRecord(entitySetName: string, recordId: string): Promise<void> {
        try {
            this.logger.info(`Deleting record: ${entitySetName}(${recordId})`);

            await this.context.webAPI.deleteRecord(entitySetName, recordId);
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'WebApiService',
                operation: 'deleteRecord',
                entity: entitySetName,
                recordId
            });
            this.logger.error('Error in deleteRecord', error, errorInfo.context);
            throw this.handleError(error);
        }
    }

    /**
     * Execute a Web API action or function
     */
    async executeAction(
        actionName: string,
        parameters?: Record<string, any>
    ): Promise<any> {
        try {
            this.logger.info(`Executing action: ${actionName}`);

            const response = await this.context.webAPI.execute(
                actionName,
                parameters
            );

            return response;
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'WebApiService',
                operation: 'executeAction',
                entity: actionName
            });
            this.logger.error('Error in executeAction', error, errorInfo.context);
            throw this.handleError(error);
        }
    }

    /**
     * Handle and format errors
     */
    private handleError(error: any): Error {
        const errorInfo = ErrorHandler.parse(error);
        return new Error(ErrorHandler.getUserMessage(error));
    }
}


