import React, { forwardRef } from "react";

const Input = forwardRef(function CustomInput({ errorMessage, ...props }, ref) {
    return (
        <>
            <input {...props} ref={ref} />
            {errorMessage && <div id={props.id} className="invalid-feedback">
                {errorMessage}
            </div>}
        </>
    );
});

export { Input };