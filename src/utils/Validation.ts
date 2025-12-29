/**
 * Validation utilities
 */

export class Validation {
    /**
     * Validate GUID format
     */
    static isValidGuid(guid: string): boolean {
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return guidRegex.test(guid);
    }

    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate required field
     */
    static isRequired(value: any): boolean {
        if (value === null || value === undefined) {
            return false;
        }
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        return true;
    }

    /**
     * Validate entity name
     */
    static isValidEntityName(entityName: string): boolean {
        if (!entityName || typeof entityName !== 'string') {
            return false;
        }
        // Entity names should be lowercase and contain only letters, numbers, and underscores
        const entityNameRegex = /^[a-z][a-z0-9_]*$/;
        return entityNameRegex.test(entityName);
    }
}


