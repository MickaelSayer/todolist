/**
 * fade entry from the left
 * 
 * @returns animation
 */
export const animateFormDisplay = () => {
    return {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
        transition: { ease: "easeOut", duration: .6 }
    }
}

/**
 * Magnification
 * 
 * @returns animation
 */
export const animateButton = () => {
    return {
        whileHover: { scale: 1.05 },
        transition: { ease: "easeInOut", duration: .2 }
    }
}

/**
 * fade entry from the top
 * 
 * @returns animation
 */
export const animateFormErrorsTasks = () => {
    return {
        initial: { y: -5, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -5, opacity: 0 },
        transition: { ease: "easeOut", duration: .3 }
    }
}

/**
 * Tremor animation
 * 
 * @param {string} Error Error if there is one
 * 
 * @returns animate
 */
export const animateFormInputError = (error) => {
    if (error) {
        return {
            initial: { rotate: 0 },
            animate: { rotate: [0, -0.3, 0.3, -0.3, 0.3, 0] },
            transition: { ease: "easeOut", duration: .5 }
        }
    }

    return null;
}

/**
 * Gives an appearance effect to the new input added
 * 
 * @param {number} isNewInput If a new inpute is detected returns the animation, if not null
 * 
 * @returns Animate
 */
export const animateNewInputTask = (isNewInput) => {
    if (isNewInput > 1) {
        return {
            initial: { width: 0, opacity: 0 },
            animate: { width: '100%', opacity: 1 },
            exit: { width: 0, opacity: 0 },
            transition: { ease: "easeOut", duration: .5 }
        }
    }

    return null;
}