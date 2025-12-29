/**
 * Example usage of DataverseService
 * This file demonstrates how to use the DataverseService in your components
 */

/// <reference types="powerapps-component-framework" />
import { DataverseService } from "../DataverseService";

// Example: Fetching records
export async function exampleFetchRecords(
  context: ComponentFramework.Context<any>
) {
  const service = new DataverseService(context);

  // Fetch accounts with filters and selection
  const accounts = await service.fetchRecords("accounts", {
    select: ["accountid", "name", "emailaddress1", "telephone1"],
    filter: "statecode eq 0", // Active accounts only
    orderby: "name",
    top: 10,
  });

  console.log("Fetched accounts:", accounts.value);
  return accounts;
}

// Example: Fetching a single record
export async function exampleFetchSingleRecord(
  context: ComponentFramework.Context<any>,
  accountId: string
) {
  const service = new DataverseService(context);

  const account = await service.fetchRecord("accounts", accountId, [
    "name",
    "emailaddress1",
    "telephone1",
    "address1_city",
  ]);

  console.log("Fetched account:", account);
  return account;
}

// Example: Creating a record
export async function exampleCreateRecord(
  context: ComponentFramework.Context<any>
) {
  const service = new DataverseService(context);

  const recordId = await service.createRecord("accounts", {
    name: "New Account Name",
    emailaddress1: "contact@example.com",
    telephone1: "555-1234",
    address1_city: "Seattle",
  });

  console.log("Created account with ID:", recordId);
  return recordId;
}

// Example: Updating a record
export async function exampleUpdateRecord(
  context: ComponentFramework.Context<any>,
  accountId: string
) {
  const service = new DataverseService(context);

  await service.updateRecord("accounts", accountId, {
    name: "Updated Account Name",
    emailaddress1: "newemail@example.com",
  });

  console.log("Account updated successfully");
}

// Example: Deleting a record
export async function exampleDeleteRecord(
  context: ComponentFramework.Context<any>,
  accountId: string
) {
  const service = new DataverseService(context);

  await service.deleteRecord("accounts", accountId);
  console.log("Account deleted successfully");
}

// Example: Complex query with expand
export async function exampleComplexQuery(
  context: ComponentFramework.Context<any>
) {
  const service = new DataverseService(context);

  // Fetch contacts with related account information
  const contacts = await service.fetchRecords("contacts", {
    select: ["contactid", "firstname", "lastname", "emailaddress1"],
    filter: "statecode eq 0",
    expand: ["parentcustomerid_account"],
    top: 20,
    orderby: "lastname",
  });

  console.log("Fetched contacts with accounts:", contacts.value);
  return contacts;
}

// Example: Using in a React component hook
export function exampleUseInHook(context: ComponentFramework.Context<any>) {
  const service = new DataverseService(context);

  const fetchData = async () => {
    try {
      const data = await service.fetchRecords("accounts", {
        select: ["name", "emailaddress1"],
        top: 5,
      });
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  return { fetchData };
}
