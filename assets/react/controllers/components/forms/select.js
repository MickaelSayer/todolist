import React from "react";

/**
 * @param {object} props The proprieties of the Select
 * @param {object} options The different proprieties of options
 */
const Select = ({ options, ...props }) => {
    return (
        <select {...props}>
            {options.map((option) => (
                <option
                    key={option.key}
                    value={option.value}
                    defaultValue={option.defaultValue}
                >
                    {option.name}
                </option>
            ))}
        </select>
    )
}

export default Select;