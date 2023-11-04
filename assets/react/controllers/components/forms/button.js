import React from "react";
import { m } from "framer-motion";

const Button = (props) => {
    return <m.button {...props}>{props.children}</m.button>;
}

export default Button;
