/**
 * Dataverse Response Models
 */

export interface DataverseResponse {
    value: DataverseRecord[];
    '@odata.count'?: number;
    '@odata.nextLink'?: string;
}

export interface DataverseRecord {
    [key: string]: any;
    '@odata.etag'?: string;
    '@odata.id'?: string;
    '@odata.type'?: string;
}

/**
 * Query Options for Dataverse queries
 */
export interface QueryOptions {
    select?: string[];
    filter?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    expand?: string[];
    count?: boolean;
}

/**
 * Options for creating records
 */
export interface CreateRecordOptions {
    returnEntity?: boolean;
}

/**
 * Options for updating records
 */
export interface UpdateRecordOptions {
    returnEntity?: boolean;
}

/**
 * Common Entity Fields
 */
export interface BaseEntityFields {
    createdon?: string;
    modifiedon?: string;
    createdby?: string;
    modifiedby?: string;
    owninguser?: string;
    owningteam?: string;
    ownerid?: string;
    statecode?: number;
    statuscode?: number;
}

/**
 * Example: Account Entity
 */
export interface Account extends BaseEntityFields {
    accountid?: string;
    name?: string;
    accountnumber?: string;
    emailaddress1?: string;
    telephone1?: string;
    address1_city?: string;
    address1_stateorprovince?: string;
    address1_country?: string;
}

/**
 * Example: Contact Entity
 */
export interface Contact extends BaseEntityFields {
    contactid?: string;
    firstname?: string;
    lastname?: string;
    emailaddress1?: string;
    telephone1?: string;
    parentcustomerid?: string;
}

/**
 * Web API Error Response
 */
export interface WebApiError {
    error: {
        code: string;
        message: string;
        innererror?: {
            message: string;
            type: string;
            stacktrace?: string;
        };
    };
}


