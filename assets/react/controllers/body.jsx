import React, { StrictMode, useId, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "./components/forms/button";
import Input from "./components/forms/input";
import Label from "./components/forms/label";
import useForm from "./hooks/useForm";
import { FormContext, useFormContext } from "./context/useFormContext";
import { LazyMotion, m, AnimatePresence } from "framer-motion";
import {
    animateButton,
    animateFormErrorsTasks,
    animateFormInputError,
    animateNewInputTask,
    animateFormDisplay,
} from "./framerMotion/animate";

function Body() {
    return (
        <StrictMode>
            <section>
                <h1 className="mb-5">My tasks</h1>
                <LazyMotion
                    features={() =>
                        import("./framerMotion/features").then(
                            (res) => res.default
                        )
                    }
                >
                    <TodoTable />
                </LazyMotion>
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
            {isCreate ? (
                <TaskCreationForm
                    setDatas={setDatas}
                    setIsCreate={setIsCreate}
                />
            ) : (
                <Button
                    {...animateButton()}
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
        <AnimatePresence>
            <m.form
                {...animateFormDisplay()}
                noValidate
                className="mb-5 border border-ligth rounded-2 p-5 position-relative"
                onSubmit={(e) => handleSubmit(e, onSubmit)}
            >
                <h2 className="position-absolute top-0 start-50 translate-middle bg-white px-4 border-start border-end">
                    Creation of a task
                </h2>

                <FormContext.Provider value={{ register, errors, handleResetErrorField }}>
                    <FormInputTitle />
                    <FormInputsTasks
                        listsInputTask={listsInputTask}
                        setListsInputTask={setListsInputTask}
                        countTasks={countTasks}
                        setCountTasks={setCountTasks}
                    />
                </FormContext.Provider>

                <Button
                    {...animateButton()}
                    type="submit"
                    className="btn btn-primary me-3"
                >
                    Save
                </Button>

                <Button
                    {...animateButton()}
                    onClick={() => setIsCreate((prevIsCreate) => !prevIsCreate)}
                    type="button"
                    className="btn btn-danger"
                >
                    Cancel
                </Button>
            </m.form>
        </AnimatePresence>
    );
};

const FormInputTitle = () => {
    const { register, errors, handleResetErrorField } = useFormContext();

    return (
        <div className="mb-3">
            <Label htmlFor="title" className="form-label fw-medium">
                Title
            </Label>
            <Input
                {...animateFormInputError(errors.title)}
                {...register("title", {
                    required: {
                        message: "The title field is compulsory",
                    },
                })}
                id="title"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                type="text"
                onClick={() => {handleResetErrorField('title')}}
            />
            <AnimatePresence>
                {errors.title && (
                    <m.div
                        {...animateFormErrorsTasks()}
                        id="title"
                        className="invalid-feedback"
                    >
                        {errors.title}
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FormInputsTasks = ({
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
            <AnimatePresence>
                {listsInputTask.map((listInput) => (
                    <m.div
                        {...animateNewInputTask(countTasks)}
                        key={listInput.id}
                        className="mb-1"
                    >
                        <TaskInput
                            id={listInput.id}
                            handleDeleteTask={handleDeleteTask}
                        />
                    </m.div>
                ))}
            </AnimatePresence>
            <Button
                {...animateButton()}
                type="button"
                className="btn btn-success mt-3"
                onClick={handleAddTasks}
            >
                Add a task <i className="bi bi-plus-lg"></i>
            </Button>
        </div>
    );
};

const TaskInput = ({ id, handleDeleteTask }) => {
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
                    {...animateFormInputError(errors[id])}
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
            <AnimatePresence>
                {errors[id] && (
                    <m.div
                        {...animateFormErrorsTasks()}
                        id={id}
                        className="invalid-feedback d-block"
                    >
                        {errors[id]}
                    </m.div>
                )}
            </AnimatePresence>
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
