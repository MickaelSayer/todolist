import React, { StrictMode, useId, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "./components/forms/button";
import Input from "./components/forms/input";
import Label from "./components/forms/label";
import useForm from "./hooks/useForm";

function Body() {
    return (
        <StrictMode>
            <section>
                <h1 className="mb-5">My tasks</h1>
                <TodoTable />
            </section>
        </StrictMode>
    );
}

const TodoTable = () => {
    const [datas, setDatas] = useState([
        {
            id: 1,
            title: "List of races",
            lists: ["Buy milk"],
        },
        {
            id: 2,
            title: "Development Project",
            lists: [
                "Implement X functionality",
                "Write documentation",
                "Perform tests",
            ],
        },
        {
            id: 3,
            title: "morning routine",
            lists: [
                "To exercise",
                "Take a shower",
                "Have breakfast",
                "To buy vegetables",
            ],
        },
        {
            id: 4,
            title: "spring cleaning",
            lists: ["Wash the windows", "To vacuum", "Organize the closet"],
        },
        {
            id: 5,
            title: "Travel planning",
            lists: ["Book plane tickets", "book the hotel"],
        },
    ]);

    return (
        <>
            <TaskCreationContainer setDatas={setDatas} />
            {datas.map((task) => (
                <TasksTable key={task.id} task={task} />
            ))}
        </>
    );
};

const TaskCreationContainer = ({ setDatas }) => {
    const [isCreate, setIsCreate] = useState(false);

    return (
        <>
            {!isCreate ? (
                <Button
                    type="button"
                    onClick={() => setIsCreate(true)}
                    className="btn btn-primary d-block m-auto mb-5"
                >
                    Create a task
                </Button>
            ) : (
                <TaskCreationForm
                    setDatas={setDatas}
                    setIsCreate={setIsCreate}
                />
            )}
        </>
    );
};

const TaskCreationForm = ({ setIsCreate, setDatas }) => {
    const { register, handleSubmit, errors } = useForm();
    const [countTasks, setCountTasks] = useState(1);
    const [listsInputTask, setListsInputTask] = useState([
        { id: `tasks_${countTasks}` },
    ]);

    const onSubmit = (formData) => {
        const dataTitle = formData.get("title");

        const listsInputSave = [];
        listsInputTask.map((list) => {
            listsInputSave.push(formData.get(list.id));
        });

        setDatas((prevDatas) => [
            ...prevDatas,
            {
                id: uuidv4(),
                title: dataTitle,
                lists: listsInputSave,
            },
        ]);

        setIsCreate(false);
    };

    return (
        <form
            noValidate
            className="mb-5 border border-ligth rounded-2 p-5 position-relative"
            onSubmit={(e) => handleSubmit(e, onSubmit)}
        >
            <h2 className="position-absolute top-0 start-50 translate-middle bg-white px-4 border-start border-end">
                Creation of a task
            </h2>

            <FormInputTitle register={register} errors={errors} />
            <FormInputsTasks
                register={register}
                errors={errors}
                listsInputTask={listsInputTask}
                setListsInputTask={setListsInputTask}
                countTasks={countTasks}
                setCountTasks={setCountTasks}
            />

            <Button type="submit" className="btn btn-primary me-3">
                Save
            </Button>

            <Button
                onClick={() => setIsCreate(false)}
                type="button"
                className="btn btn-danger"
            >
                Cancel
            </Button>
        </form>
    );
};

const FormInputTitle = ({ register, errors }) => {
    return (
        <div className="mb-3">
            <Label htmlFor="title" className="form-label">
                Title
            </Label>
            <Input
                {...register("title", {
                    required: {
                        message: "The title field is compulsory",
                    },
                })}
                id="title"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                type="text"
            />
            {errors.title && (
                <div id="title" className="invalid-feedback">
                    {errors.title}
                </div>
            )}
        </div>
    );
};

const FormInputsTasks = ({
    register,
    errors,
    listsInputTask,
    setListsInputTask,
    countTasks,
    setCountTasks,
}) => {
    const handleAddTasks = () => {
        setCountTasks((c) => c + 1);

        setListsInputTask((prevListInput) => [
            ...prevListInput,
            { id: `tasks_${countTasks + 1}` },
        ]);
    };

    const handleDeleteTask = (id) => {
        setListsInputTask(
            listsInputTask.filter((listInput) => listInput.id !== id)
        );
    };

    return (
        <div className="mb-3">
            {listsInputTask.map((listInput) => (
                <div key={listInput.id} className="mb-1">
                    <TaskInput
                        register={register}
                        errors={errors}
                        id={listInput.id}
                        handleDeleteTask={handleDeleteTask}
                    />
                </div>
            ))}
            <Button
                type="button"
                className="btn btn-success mt-3"
                onClick={handleAddTasks}
            >
                Add a task <i className="bi bi-plus-lg"></i>
            </Button>
        </div>
    );
};

const TaskInput = ({ register, errors, id, handleDeleteTask }) => {
    return (
        <>
            {id === "tasks_1" && (
                <Label htmlFor={id} className="form-label">
                    Tasks
                </Label>
            )}
            <div className="d-flex flex-row align-items-center">
                {id !== "tasks_1" && (
                    <Button
                        type="button"
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDeleteTask(id)}
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                )}
                <Input
                    {...register(id, {
                        required: {
                            message: "The title field is compulsory",
                        },
                    })}
                    id={id}
                    className={`form-control ${errors[id] ? "is-invalid" : ""}`}
                    type="text"
                />
            </div>
            {errors[id] && (
                <div id={id} className="invalid-feedback d-block">
                    {errors[id]}
                </div>
            )}
        </>
    );
};

const TasksTable = ({ task }) => {
    const [countChecked, setCountChecked] = useState(task.lists.length);

    /**
     * Return the list of a stain
     *
     * @param {string} list
     */
    const listMap = (list) => {
        const taskListId = useId();

        return (
            <TaskBody
                list={list}
                key={taskListId}
                keyId={taskListId}
                setCountChecked={setCountChecked}
            />
        );
    };

    return (
        <table className="table table-striped mb-5" key={task.id}>
            <thead>
                <TaskHeader countChecked={countChecked} task={task} />
            </thead>
            <tbody>{task.lists.map((list) => listMap(list))}</tbody>
        </table>
    );
};

const TaskHeader = ({ countChecked, task }) => {
    return (
        <tr>
            <th scope="col" className="d-flex flex-sm-row flex-column">
                <div>{task.title}</div>
                <div className="mx-3">
                    {countChecked !== 0 ? (
                        <>
                            <span className="badge bg-success">
                                {task.lists.length}
                            </span>
                            <span className="mx-2">/</span>
                            <span
                                className={`badge bg-${
                                    countChecked === 0 ? "success" : "danger"
                                }`}
                            >
                                {Math.abs(countChecked - task.lists.length)}
                            </span>
                        </>
                    ) : (
                        <span className="badge bg-success">Terminé</span>
                    )}
                </div>
            </th>
        </tr>
    );
};

const TaskBody = ({ list, keyId, setCountChecked }) => {
    const [listChecked, setListChecked] = useState(false);

    const handlerListChecked = () => {
        setListChecked(!listChecked);

        setCountChecked((prevCountChecked) => {
            const count = !listChecked
                ? prevCountChecked - 1
                : prevCountChecked + 1;

            return count;
        });
    };

    return (
        <tr className="border border-ligth">
            <th className="fw-light">
                <Input
                    className="form-check-input me-3"
                    type="checkbox"
                    checked={listChecked}
                    onChange={handlerListChecked}
                    id={keyId}
                />
                <Label
                    className={`form-check-label ${
                        listChecked ? "text-decoration-line-through" : ""
                    }`}
                    htmlFor={keyId}
                >
                    {list}
                </Label>
            </th>
        </tr>
    );
};

export default Body;
