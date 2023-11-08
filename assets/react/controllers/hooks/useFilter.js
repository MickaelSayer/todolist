import { useState } from "react";

/**
 * Add one or more filters to a data table
 * 
 * @param {object} datas
 * @param {object} filters 
 */
const useFilter = (datas, filters) => {
    const [filtersDatas, setFiltersDatas] = useState(filters);

    return { filtersDatas }
}

export default useFilter;