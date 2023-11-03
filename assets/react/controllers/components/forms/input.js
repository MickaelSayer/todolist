import React from "react";

const Input = ({ errorMessage, ...props }) => {
    return (
        <>
            <input {...props} />
            {errorMessage && <div id={props.id} className="invalid-feedback">
                {errorMessage}
            </div>}
        </>
    );
};

export default Input;