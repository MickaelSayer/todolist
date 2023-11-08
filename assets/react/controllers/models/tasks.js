import { useState } from "react";

const useTasks = (initialFilters = []) => {
    const fields = ['id', 'title', 'lists', 'created_at'];
    let intitialDatas = [
        {
            id: 1,
            title: "List of races",
            lists: [{ id: 1, name: "Buy milk", checked: true }],
            created_at: new Date(2023, 9, 5),
        },
        {
            id: 2,
            title: "Development Project",
            lists: [
                { id: 2, name: "Implement X functionality", checked: true },
                { id: 3, name: "Write documentation", checked: true },
                { id: 4, name: "Perform tests", checked: false },
            ],
            created_at: new Date(2023, 9, 11),
        },
        {
            id: 3,
            title: "morning routine",
            lists: [
                { id: 5, name: "To exercise", checked: true },
                { id: 6, name: "Take a shower", checked: false },
                { id: 7, name: "Have breakfast", checked: false },
                { id: 8, name: "To buy vegetables", checked: false },
            ],
            created_at: new Date(2023, 9, 17),
        },
        {
            id: 4,
            title: "spring cleaning",
            lists: [
                { id: 9, name: "Wash the windows", checked: false },
                { id: 10, name: "To vacuum", checked: false },
                { id: 11, name: "Organize the closet", checked: false },
            ],
            created_at: new Date(2023, 9, 21),
        },
        {
            id: 5,
            title: "Travel planning",
            lists: [
                { id: 12, name: "Book plane tickets", checked: false },
                { id: 13, name: "book the hotel", checked: false },
            ],
            created_at: new Date(2023, 9, 29),
        },
    ]
    const [filters, setFilters] = useState(initialFilters);

    const initialDataFiltered = _addFiltersNewDatas(filters, fields, intitialDatas);
    const [datas, setDatas] = useState(initialDataFiltered);
    
    /**
     * Changes data with new filters
     * 
     * @param {object} newOptionsFilter The new filter table
     */
    const updateFilter = (newOptionsFilter) => {
        const updateDatas = _addFiltersNewDatas(newOptionsFilter, fields, datas);
        setFilters(newOptionsFilter);
        setDatas(updateDatas);
    };

    /**
     * Creation of a task respecting the filters
     * 
     * @param {object} datasCreate Data for the new task
     */
    const createTask = (datasCreate) => {
        const updateDatas = _addFiltersNewDatas(filters, fields, [...datas, datasCreate])
        setDatas(updateDatas);
    }

    return { datas, setDatas, filters, updateFilter, createTask }
}

/**
 * Filter datas
 * 
 * @param {object} filters 
 * @param {object} fields 
 * @param {object} datas 
 * 
 * @returns Filtered datas
 */
const _addFiltersNewDatas = (filters, fields, datas) => {
    let newDatas = [...datas];
    if (filters.length !== 0) {
        fields.forEach((field) => {
            if (filters[field] !== undefined && filters[field].action === 'sort') {
                if (filters[field].type === "desc") {
                    newDatas = newDatas.sort((a, b) => b[field] - a[field]);
                } else {
                    newDatas = newDatas.sort((a, b) => a[field] - b[field]);
                }
            }
        });
    }

    return newDatas;
}

export default useTasks