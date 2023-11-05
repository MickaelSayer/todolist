import React, { StrictMode, useId, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "./components/forms/button";
import Input from "./components/forms/input";
import Label from "./components/forms/label";
import useForm from "./hooks/useForm";
import { FormContext, useFormContext } from "./context/useFormContext";

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
                <ListsTasks key={task.id} task={task} />
            ))}
        </>
    );
};

const TaskCreationContainer = ({ setDatas }) => {
    const [isCreate, setIsCreate] = useState(false);

    return (
        <>
            {isCreate ? (
                <TaskCreationForm
                    setDatas={setDatas}
                    setIsCreate={setIsCreate}
                />
            ) : (
                <Button
                    type="button"
                    onClick={() => setIsCreate((prevIsCreate) => !prevIsCreate)}
                    className="btn btn-primary d-block m-auto mb-5"
                >
                    Create a task
                </Button>
            )}
        </>
    );
};

const TaskCreationForm = ({ setIsCreate, setDatas }) => {
    const { register, handleSubmit, errors, handleResetErrorField } = useForm();
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

        setIsCreate((prevIsCreate) => !prevIsCreate);
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

            <FormContext.Provider
                value={{ register, errors, handleResetErrorField }}
            >
                <InputTitle />
                <InputsTasks
                    listsInputTask={listsInputTask}
                    setListsInputTask={setListsInputTask}
                    countTasks={countTasks}
                    setCountTasks={setCountTasks}
                />
            </FormContext.Provider>

            <Button type="submit" className="btn btn-success me-3">
                Save
            </Button>

            <Button
                onClick={() => setIsCreate((prevIsCreate) => !prevIsCreate)}
                type="button"
                className="btn btn-danger"
            >
                Cancel
            </Button>
        </form>
    );
};

const InputTitle = () => {
    const { register, errors, handleResetErrorField } = useFormContext();

    return (
        <div className="mb-3">
            <Label htmlFor="title" className="form-label fw-medium">
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
                onClick={() => {
                    handleResetErrorField("title");
                }}
            />

            {errors.title && (
                <div id="title" className="invalid-feedback">
                    {errors.title}
                </div>
            )}
        </div>
    );
};

const InputsTasks = ({
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
                    <InputTask
                        id={listInput.id}
                        handleDeleteTask={handleDeleteTask}
                    />
                </div>
            ))}
            <Button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleAddTasks}
            >
                Add a task <i className="bi bi-plus-lg"></i>
            </Button>
        </div>
    );
};

const InputTask = ({ id, handleDeleteTask }) => {
    const { register, errors, handleResetErrorField } = useFormContext();

    return (
        <>
            {id === "tasks_1" && (
                <Label htmlFor={id} className="form-label fw-medium">
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
                            message: "The task field is compulsory",
                        },
                    })}
                    id={id}
                    className={`form-control ${errors[id] ? "is-invalid" : ""}`}
                    type="text"
                    onClick={() => handleResetErrorField(id)}
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

const ListsTasks = ({ task }) => {
    const [countChecked, setCountChecked] = useState(task.lists.length);
    const [filter, setFilter] = useState(false);

    const listMap = (list, index) => {
        const taskListId = useId();

        return (
            <BodyListTask
                key={taskListId}
                index={index}
                task={list}
                setCountChecked={setCountChecked}
            />
        );
    };

    return (
        <ul className="border border-ligth p-0 rounded-2 mx-3 mb-5">
            <HeaderListTask task={task} countChecked={countChecked} />
            <li className="list-group">
                <ul className="p-0">
                    {task.lists.map((list, index) => {
                        listMap(list, index);
                    })}
                </ul>
            </li>
        </ul>
    );
};

const HeaderListTask = ({ task, countChecked }) => {
    return (
        <li className="list-group d-flex flex-row justify-content-between p-3 rounded-0 border-bottom border-ligth">
            <div className="d-flex align-items-center">
                <div className="me-3">{task.title}</div>
                {countChecked !== 0 ? (
                    <div>
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
                    </div>
                ) : (
                    <span className="badge bg-success">Terminé</span>
                )}
            </div>
            <div>
                <Button className="btn btn-secondary btn-sm" type="button">
                    <i className="bi bi-filter"></i>
                </Button>
            </div>
        </li>
    );
};

const BodyListTask = ({ task, setCountChecked, index }) => {
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
        <li
            className={`list-group ${
                index % 2 === 0 ? "bg-light" : ""
            } d-flex flex-row px-5 py-3 rounded-2`}
        >
            <Input
                className="form-check-input me-3"
                type="checkbox"
                checked={listChecked}
                onChange={handlerListChecked}
                id={useId()}
            />
            <Label
                className={`form-check-label ${
                    listChecked ? "text-decoration-line-through" : ""
                }`}
                htmlFor={useId()}
            >
                {task}
            </Label>
        </li>
    );
};

export default Body;
