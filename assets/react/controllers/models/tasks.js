import { useState } from "react";

const useTasks = () => {
    const tasksFields = {
        id: {},
        title: {},
        lists: {
            filter: {
                name: 'lists',
                type: "filter",
                defaultFilter: "allChecked",
            }
        },
        created_at: {
            filter: {
                name: 'created_at',
                type: "sort",
                defaultFilter: "desc",
            }
        }
    };
    const intitialDatas = [
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
    const [fields, setFields] = useState(tasksFields);
    intitialDatas.sort((a, b) => b.created_at - a.created_at)
    const [datas, setDatas] = useState(intitialDatas);

    /**
     * Creation of a task respecting the filters
     * 
     * @param {object} datasCreate Data for the new task
     */
    const createTask = (currentFields, datasCreate) => {
        __backupFilteredDatas(currentFields, [...datas, datasCreate])
    }

    /**
     * Update of the state of the task when she is checked/unclogged
     * 
     * @param {id} taskId The identifier of the List A Check/Decochée
     */
    const updateTaskChecked = (taskId) => {
        setDatas((prevDatas) => prevDatas.map((data) => {
            const taskListFocus = data.lists.map((list) => {
                if (list.id === taskId) {
                    return {
                        ...list,
                        checked: !list.checked
                    };
                }
                return list;
            });

            return {
                ...data,
                lists: taskListFocus
            };
        }));
    }

    /**
     * Manage the change of filter
     * 
     * @param {object} eventFilter 
     */
    const handleChangeFilter = (eventFilter) => {
        const selectName = eventFilter.target.name;
        const optionValue = eventFilter.target.value;

        const newFilter = {
            [selectName]: {
                filter: {
                    name: selectName,
                    type: fields[selectName].filter.type,
                    defaultFilter: optionValue,
                }
            },
        };

        const newFilters = { ...fields, ...newFilter };
        setFields(newFilters);

        __backupFilteredDatas(newFilters)
    };

    /**
     * Saves filtered data
     * 
     * @param {object} newFilters 
     */
    const __backupFilteredDatas = (newFilters, currentDatas = []) => {
        let datasFiltered = currentDatas.length === 0 ? [...datas] : currentDatas;

        if (newFilters.length !== 0) {
            for (const [key, field] of Object.entries(newFilters)) {
                if (Object.keys(field).length !== 0) {
                    if (field.filter.type === 'sort' && field.filter.defaultFilter === 'desc') {
                        datasFiltered.sort((a, b) => b[field.filter.name] - a[field.filter.name])
                    } else {
                        datasFiltered.sort((a, b) => a[field.filter.name] - b[field.filter.name])
                    }
                }
            }
        }

        setDatas(datasFiltered)
    }

    return {
        datas,
        createTask,
        updateTaskChecked,
        fields,
        handleChangeFilter
    }
}

export default useTasks