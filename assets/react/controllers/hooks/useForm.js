import { useState } from "react";

/**
 * Manage the verification of the form fields
 * 
 * @returns {object} { register, handleSubmit, errors, resetErrorField }
 */
const useForm = () => {
    const registeredFields = [];
    const [errors, setErrors] = useState([])

    /**
     * Built the checks useful for forms
     * 
     * @param {string} name 
     * @param {object} options 
     * @returns 
     */
    const register = (name, options = {}) => {
        let validationFields = registeredFields[name] = options;

        const minLengthValue = _optionControl(validationFields, 'minLength', 'value');
        const maxLengthValue = _optionControl(validationFields, 'maxLength', 'value');
        const required = _optionControl(validationFields, 'required');

        return {
            name,
            minLength: minLengthValue,
            maxLength: maxLengthValue,
            required
        };
    };

    /**
     * Manage the verification of the form fields after submit
     * 
     * @param {object} e 
     */
    const handleSubmit = (e, onSubmit) => {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        const errorsFields = {};

        for (const key in registeredFields) {
            let data = formData.get(key);

            if (data === null) {
                delete errorsFields[key]
            } else {
                let minLengthValue = _optionControl(registeredFields[key], 'minLength', 'value');
                let minLengthMessage = _optionControl(registeredFields[key], 'minLength', 'message');
                let maxLengthValue = _optionControl(registeredFields[key], 'minLength', 'value');
                let maxLengthMessage = _optionControl(registeredFields[key], 'maxLength', 'message');
                let required = _optionControl(registeredFields[key], 'required');
                let requiredmessage = _optionControl(registeredFields[key], 'required', 'message');


                if (required && data.length === 0) {
                    errorsFields[key] = requiredmessage;
                } else if (minLengthValue && data.length <= minLengthValue) {
                    errorsFields[key] = minLengthMessage;
                } else if (maxLengthValue && data.length >= maxLengthValue) {
                    errorsFields[key] = maxLengthMessage;
                }

                if (errorsFields[key] === undefined) {
                    delete errorsFields[key]
                }
            }
        }

        setErrors(errorsFields)

        if (Object.keys(errorsFields).length === 0) {
            onSubmit(formData)
        }
    }

    /**
     * Delete form errors on the click on the field
     * 
     * @param {string} key The key to the field
     */
    const handleResetErrorField = (key) => {
        if (Object.keys(errors).length !== 0) {
            setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[key];

                return updatedErrors;
            });
        }
    }

    return { register, handleSubmit, errors, handleResetErrorField };
};

/**
 * Reclaims the different form of form of the form
 * 
 * @param {object} options 
 * @param {string} param 
 * @param {string} type 
 * 
 * @returns Returns the value of the control option
 */
function _optionControl(options, param, type = null) {
    if (type === null) {
        return options?.[param];
    }

    return options?.[param]?.[type];
}

export default useForm;
