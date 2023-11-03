/**
 * Return the form errors of the form
 * 
 * @param {Object} fields Form field data
 * @returns An object with the errors of the form
 */
export function FormValidator(fields) {
    for (const field in fields) {
        validateFields(field, fields)
    }

    return getErrors(fields);
}

/**
 * Check the errors in the form in relation to conditions
 * 
 * @param {Object} fields Form field data
 * @returns An object with the errors of the form
 */
function getErrors(fields) {
    const currentError = {};

    for (const field in fields) {
        let currentField = fields[field];
        let name = currentField.data.name;
        let value = currentField.data.value;

        let isEmpty = currentField.required && value.length === 0;
        let isMinLength = currentField.minLength && value.length < currentField.minLength.value;
        let isMaxLength = currentField.maxLength && value.length > currentField.maxLength.value;

        if (isEmpty) {
            currentError[name] = currentField.required.message;
        } else if (isMinLength) {
            currentError[name] = currentField.minLength.message;
        } else if (isMaxLength) {
            currentError[name] = currentField.maxLength.message;
        }
    }

    return currentError;
}

/**
 * Entering data verification
 * 
 * @param {string} field The name given to the form of the form
 * @param {Object} fields Form field data
 */
function validateFields(field, fields) {
    const maxLength = fields[field].maxLength;
    const minLength = fields[field].minLength;

    if (typeof fields !== 'object') {
        throw new Error('Le paramètre "fields" doit être un objet');
    }

    if (typeof field !== 'string') {
        throw new Error(`The key "${field}" in the object "fields" must be a character string`);
    }

    if (fields[field].data) {
        if (typeof fields[field].data.name !== 'string') {
            throw new Error(`The "name" property of "data" of "${field}" must be a character string`);
        }
    } else {
        throw new Error(`The "key" property of "data" of "${field}" must be not a empty`);
    }

    if (maxLength) {
        if (typeof maxLength.value !== 'number') {
            throw new Error(`The "Value" property of "Maxlength" of "${field}" must be a number`);
        }

        if (maxLength.message && typeof maxLength.message !== 'string') {
            throw new Error(`The "message" property of "Maxlength" of "${field}" must be a character string`);
        }
    }

    if (minLength) {
        if (typeof minLength.value !== 'number') {
            throw new Error(`The "value" property of "minlength" of "${field}" must be a number`);
        }

        if (minLength.message && typeof minLength.message !== 'string') {
            throw new Error(`The "message" property of "minlength" of "${field}" must be a character string`);
        }
    }

    if (fields[field].required) {
        if (typeof fields[field].required.message !== 'string') {
            throw new Error(`The "message" property of "required" of "${field}" must be a character string`);
        }
    }
}