import { ValidationRule, ValidationResult, ValidationContext } from './ValidationRules';
import { ValidationRules } from './ValidationRules';
import { Logger } from '../logging/Logger';

/**
 * Entity validation schema
 */
export interface EntitySchema {
    [fieldName: string]: ValidationRule[];
}

/**
 * Enhanced Validator service
 */
export class Validator {
    private static logger: Logger = Logger.getInstance('Validator');
    private static customRules: Map<string, ValidationRule> = new Map();

    /**
     * Validate value against rules
     */
    static validate(value: any, rules: ValidationRule[], context?: ValidationContext): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        for (const rule of rules) {
            try {
                const result = rule(value, context);
                if (!result.isValid) {
                    errors.push(...result.errors);
                }
                if (result.warnings) {
                    warnings.push(...result.warnings);
                }
            } catch (error) {
                this.logger.error('Validation rule error', error, { value, context });
                errors.push('Validation error occurred');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Validate value asynchronously (for async validation rules)
     */
    static async validateAsync(
        value: any,
        rules: ValidationRule[],
        context?: ValidationContext
    ): Promise<ValidationResult> {
        const results = await Promise.all(
            rules.map(async (rule) => {
                try {
                    const result = rule(value, context);
                    return Promise.resolve(result);
                } catch (error) {
                    this.logger.error('Validation rule error', error, { value, context });
                    return {
                        isValid: false,
                        errors: ['Validation error occurred']
                    };
                }
            })
        );

        const errors: string[] = [];
        const warnings: string[] = [];

        for (const result of results) {
            if (!result.isValid) {
                errors.push(...result.errors);
            }
            if (result.warnings) {
                warnings.push(...result.warnings);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Validate entity against schema
     */
    static validateEntity(entity: Record<string, any>, schema: EntitySchema, context?: ValidationContext): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        for (const [fieldName, rules] of Object.entries(schema)) {
            const value = entity[fieldName];
            const fieldContext: ValidationContext = {
                ...context,
                fieldName
            };

            const result = this.validate(value, rules, fieldContext);
            if (!result.isValid) {
                errors.push(...result.errors.map(err => `${fieldName}: ${err}`));
            }
            if (result.warnings) {
                warnings.push(...result.warnings.map(warn => `${fieldName}: ${warn}`));
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Add custom validation rule
     */
    static addRule(name: string, rule: ValidationRule): void {
        this.customRules.set(name, rule);
        this.logger.info(`Custom validation rule added: ${name}`);
    }

    /**
     * Get custom validation rule
     */
    static getRule(name: string): ValidationRule | undefined {
        return this.customRules.get(name);
    }

    /**
     * Remove custom validation rule
     */
    static removeRule(name: string): boolean {
        return this.customRules.delete(name);
    }

    /**
     * Built-in rules accessor
     */
    static get rules() {
        return ValidationRules;
    }
}

