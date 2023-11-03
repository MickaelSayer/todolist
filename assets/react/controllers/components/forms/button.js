import React from "react";

function Button(props) {
    return <button {...props}>{props.children}</button>;
}

export { Button };
