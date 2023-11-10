import { useState } from "react";

const useTasks = () => {
    const intitialLists = [
        {
            id: 1,
            title: "List of races",
            tasks: [{ id: 1, name: "Buy milk", checked: true }],
            created_at: new Date(2023, 9, 5),
        },
        {
            id: 2,
            title: "Development Project",
            tasks: [
                { id: 2, name: "Implement X functionality", checked: true },
                { id: 3, name: "Write documentation", checked: true },
                { id: 4, name: "To exercise", checked: false },
            ],
            created_at: new Date(2023, 9, 11),
        },
        {
            id: 3,
            title: "morning routine",
            tasks: [
                { id: 5, name: "To exerc", checked: true },
                { id: 6, name: "Take a shower", checked: false },
                { id: 7, name: "Have breakfast", checked: false },
                { id: 8, name: "To buy vegetables", checked: false },
            ],
            created_at: new Date(2023, 9, 17),
        },
        {
            id: 4,
            title: "spring cleaning",
            tasks: [
                { id: 9, name: "Wash the windows", checked: false },
                { id: 10, name: "To vacuum", checked: false },
                { id: 11, name: "Organize the closet", checked: false },
            ],
            created_at: new Date(2023, 9, 21),
        },
        {
            id: 5,
            title: "Travel planning",
            tasks: [
                { id: 12, name: "Book plane tickets", checked: false },
                { id: 13, name: "book the hotel", checked: false },
            ],
            created_at: new Date(2023, 9, 29),
        },
    ]
    const [lists, setLists] = useState(intitialLists);

    /**
     * Task recording
     * 
     * @param {object} formData 
     * @param {object} listsInputTask 
     * @param {boolean} setIsCreate 
     */
    const handleSaveLists = (formData, listsInputTask, setIsCreate) => {
        const dataTitle = formData.get("title");

        const listsInputSave = createListsForm(formData, listsInputTask);

        setLists([
            ...lists,
            {
                id: lists.length + 1,
                title: dataTitle,
                tasks: listsInputSave,
                created_at: new Date(),
            },
        ]);
        setIsCreate((prevIsCreate) => !prevIsCreate);
    };

    /**
     * Creation of the task list
     * 
     * @param {object} formData 
     * @param {object} listsInputTask 
     * 
     * @returns {object} The task list
     */
    const createListsForm = (formData, listsInputTask) => {
        const lastDatas = lists[lists.length - 1];
        const lastDatasListId = lastDatas.tasks[lastDatas.tasks.length - 1].id;

        const listsInputSave = [];
        let incrementId = 1;
        listsInputTask.map((list) => {
            listsInputSave.push({
                id: lastDatasListId + incrementId,
                name: formData.get(list.id),
                checked: false,
            });

            incrementId++;
        });

        return listsInputSave;
    };

    /**
     * Changes the checked state of a task
     */
    const handleUpdateTaskChecked = (e) => {
        const TASK_ID = Number(e.target.id);
        const IS_TASK_CHECKED = e.target.checked;
    
        setLists((prevLists) =>
            prevLists.map((list) => {
                const taskListFocus = list.tasks.map((TaskList) => {
                    if (TaskList.id === TASK_ID) {
                        return {
                            ...TaskList,
                            checked: IS_TASK_CHECKED,
                        };
                    }
                    return TaskList;
                });
 
                return {
                    ...list,
                    tasks: taskListFocus,
                };
            })
        );
    };


    return {
        lists,
        setLists,
        handleSaveLists,
        handleUpdateTaskChecked
    }
}

export default useTasks