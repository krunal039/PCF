/**
 * Validation rule function type
 */
export type ValidationRule = (value: any, context?: ValidationContext) => ValidationResult;

/**
 * Validation context
 */
export interface ValidationContext {
    fieldName?: string;
    entity?: string;
    recordId?: string;
    [key: string]: any;
}

/**
 * Validation result
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

/**
 * Built-in validation rules
 */
export class ValidationRules {
    /**
     * Required field validation
     */
    static required(message?: string): ValidationRule {
        return (value: any): ValidationResult => {
            const isValid = value !== null && value !== undefined && 
                          (typeof value !== 'string' || value.trim().length > 0);
            
            return {
                isValid,
                errors: isValid ? [] : [message || 'This field is required']
            };
        };
    }

    /**
     * Email validation
     */
    static email(message?: string): ValidationRule {
        return (value: any): ValidationResult => {
            if (!value) {
                return { isValid: true, errors: [] }; // Empty is valid (use required for mandatory)
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = typeof value === 'string' && emailRegex.test(value);
            
            return {
                isValid,
                errors: isValid ? [] : [message || 'Invalid email format']
            };
        };
    }

    /**
     * GUID validation
     */
    static guid(message?: string): ValidationRule {
        return (value: any): ValidationResult => {
            if (!value) {
                return { isValid: true, errors: [] };
            }

            const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            const isValid = typeof value === 'string' && guidRegex.test(value);
            
            return {
                isValid,
                errors: isValid ? [] : [message || 'Invalid GUID format']
            };
        };
    }

    /**
     * String length validation
     */
    static length(min?: number, max?: number, message?: string): ValidationRule {
        return (value: any): ValidationResult => {
            if (!value) {
                return { isValid: true, errors: [] };
            }

            const length = typeof value === 'string' ? value.length : 0;
            let isValid = true;
            const errors: string[] = [];

            if (min !== undefined && length < min) {
                isValid = false;
                errors.push(message || `Minimum length is ${min} characters`);
            }

            if (max !== undefined && length > max) {
                isValid = false;
                errors.push(message || `Maximum length is ${max} characters`);
            }

            return { isValid, errors };
        };
    }

    /**
     * Number range validation
     */
    static range(min?: number, max?: number, message?: string): ValidationRule {
        return (value: any): ValidationResult => {
            if (value === null || value === undefined) {
                return { isValid: true, errors: [] };
            }

            const num = typeof value === 'number' ? value : parseFloat(value);
            if (isNaN(num)) {
                return { isValid: false, errors: [message || 'Value must be a number'] };
            }

            let isValid = true;
            const errors: string[] = [];

            if (min !== undefined && num < min) {
                isValid = false;
                errors.push(message || `Value must be at least ${min}`);
            }

            if (max !== undefined && num > max) {
                isValid = false;
                errors.push(message || `Value must be at most ${max}`);
            }

            return { isValid, errors };
        };
    }

    /**
     * Pattern validation (regex)
     */
    static pattern(regex: RegExp, message?: string): ValidationRule {
        return (value: any): ValidationResult => {
            if (!value) {
                return { isValid: true, errors: [] };
            }

            const isValid = typeof value === 'string' && regex.test(value);
            
            return {
                isValid,
                errors: isValid ? [] : [message || 'Value does not match required pattern']
            };
        };
    }

    /**
     * Entity name validation
     */
    static entityName(message?: string): ValidationRule {
        return (value: any): ValidationResult => {
            if (!value) {
                return { isValid: true, errors: [] };
            }

            const entityNameRegex = /^[a-z][a-z0-9_]*$/;
            const isValid = typeof value === 'string' && entityNameRegex.test(value);
            
            return {
                isValid,
                errors: isValid ? [] : [message || 'Invalid entity name format']
            };
        };
    }

    /**
     * Custom validation rule
     */
    static custom(validator: (value: any, context?: ValidationContext) => boolean, message: string): ValidationRule {
        return (value: any, context?: ValidationContext): ValidationResult => {
            const isValid = validator(value, context);
            return {
                isValid,
                errors: isValid ? [] : [message]
            };
        };
    }
}

