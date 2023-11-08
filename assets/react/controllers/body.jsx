import React, { StrictMode, createContext, useContext, useState } from "react";
import Button from "./components/forms/button";
import Input from "./components/forms/input";
import Label from "./components/forms/label";
import useForm from "./hooks/useForm";
import { FormContext, useFormContext } from "./context/useFormContext";
import Select from "./components/forms/select";
import useTasks from "./models/tasks";

const datasContext = createContext(null);

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
    const initialFilters = {
        created_at: {
            action: "sort",
            type: "desc",
            reverseType: "asc",
        },
    };

    const { datas, filters, updateFilter, createTask } = useTasks(initialFilters);

    return (
        <>
            <datasContext.Provider value={{ datas, createTask, filters, updateFilter }}>
                <TaskCreationContainer />
                <FormFilter />
            </datasContext.Provider>

            {datas.map((task) => (
                <ListsTasks key={task.id} task={task} />
            ))}
        </>
    );
};

const FormFilter = () => {
    const { filters, updateFilter } = useContext(datasContext);
    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilterDate, setValueFilterDate] = useState(
        filters.created_at.type
    );

    const handleChangeFilterDate = () => {
        let defaultFilterType = filters.created_at.type;
        let defaultFilterReverseType = filters.created_at.reverseType;

        const newFilterType =
            valueFilterDate === defaultFilterType
                ? defaultFilterReverseType
                : defaultFilterType;

        setValueFilterDate(newFilterType);
        const newOptionsFilter = {
            created_at: {
                action: "sort",
                type: newFilterType,
                reverseType: newFilterType === "desc" ? "asc" : "desc",
            },
        };

        updateFilter(newOptionsFilter);
    };

    return (
        <>
            <Button
                className={`btn btn-light ms-3 rounded-0 ${
                    openFilter ? "mb-0 rounded-top" : "mb-3 rounded-2"
                }`}
                type="button"
                onClick={() => setOpenFilter(!openFilter)}
            >
                Filters
                {!openFilter ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        fill="#929292"
                        className="bi bi-filter ms-2"
                        viewBox="0 0 16 16"
                    >
                        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                    </svg>
                ) : (
                    <i className="bi bi-x-lg text-danger ms-2"></i>
                )}
            </Button>
            {openFilter && (
                <div className="d-flex justify-content-evenly align-items-center ms-3 mb-5 bg-light p-3 rounded-bottom">
                    <div className="form-check form-switch">
                        <span className="fw-medium">By date :</span>
                        <Select
                            className="form-select form-select-sm mb-3"
                            aria-label="Select the filter for the order of the date"
                            onChange={handleChangeFilterDate}
                            value={valueFilterDate}
                            options={[
                                {
                                    value: "desc",
                                    defaultValue: valueFilterDate === "desc",
                                    name: "Descending",
                                    key: "descending",
                                },
                                {
                                    value: "asc",
                                    defaultValue: valueFilterDate === "asc",
                                    name: "Ascending",
                                    key: "ascending",
                                },
                            ]}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

const TaskCreationContainer = () => {
    const [isCreate, setIsCreate] = useState(false);

    return (
        <>
            {!isCreate ? (
                <Button
                    type="button"
                    onClick={() => setIsCreate((prevIsCreate) => !prevIsCreate)}
                    className="btn btn-primary d-block m-auto mb-5"
                >
                    Create a task
                </Button>
            ) : (
                <Button
                    onClick={() => setIsCreate((prevIsCreate) => !prevIsCreate)}
                    type="button"
                    className="btn btn-danger d-block m-auto mb-5"
                >
                    Cancel
                </Button>
            )}

            {isCreate && <TaskCreationForm setIsCreate={setIsCreate} />}
        </>
    );
};

const TaskCreationForm = ({ setIsCreate }) => {
    const { register, handleSubmit, errors, handleResetErrorField } = useForm();
    const { datas, createTask } = useContext(datasContext);
    const [countTasks, setCountTasks] = useState(1);
    const [listsInputTask, setListsInputTask] = useState([
        { id: `tasks_${countTasks}` },
    ]);

    const onSubmit = (formData) => {
        const dataTitle = formData.get("title");
        const lastDatas = datas[datas.length - 1];
        const lastDatasListId = lastDatas.lists[lastDatas.lists.length - 1].id;

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

        createTask({
            id: datas.length + 1,
            title: dataTitle,
            lists: listsInputSave,
            created_at: new Date(),
        });
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

            <Button
                type="submit"
                className="btn btn-success mt-5 d-block m-auto"
            >
                Save the task
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
    /**
     * Add a task to the form
     */
    const handleAddTasks = () => {
        setCountTasks((c) => c + 1);

        setListsInputTask((prevListInput) => [
            ...prevListInput,
            { id: `tasks_${countTasks + 1}` },
        ]);
    };

    /**
     * Deletes a task that has been added
     *
     * @param {int} id
     */
    const handleDeleteTask = (id) => {
        setListsInputTask(
            listsInputTask.filter((listInput) => listInput.id !== id)
        );
    };

    return (
        <div className="mb-3">
            {listsInputTask.map((listInput) => (
                <div key={listInput.id} className="mb-2">
                    <InputTask
                        id={listInput.id}
                        handleDeleteTask={handleDeleteTask}
                    />
                </div>
            ))}
            <Button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={handleAddTasks}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-plus-lg"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                    />
                </svg>
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
    return (
        <ul className="border border-ligth p-0 rounded-2 mx-3 mb-5">
            <HeaderListTask task={task} />
            <li className="list-group">
                <ul className="p-0">
                    {task.lists.map((list, index) => (
                        <BodyListTask key={list.id} index={index} task={list} />
                    ))}
                </ul>
            </li>
        </ul>
    );
};

const HeaderListTask = ({ task }) => {
    /**
     * Start[checkedTask]
     * Check that all tasks are finished
     */
    let countTaskChecked = 0;
    let filterTaskDisplay = false;
    task.lists.map((list) => {
        if (list.checked) {
            countTaskChecked++;
        }
    });

    if (countTaskChecked === task.lists.length) {
        filterTaskDisplay = true;
    }
    /**
     * End[checkedTask]
     */

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = task.created_at.toLocaleDateString("fr-FR", options);

    return (
        <li
            className={`list-group d-flex flex-row justify-content-between align-items-center p-3 rounded-0 border-ligth
            ${!filterTaskDisplay ? "border-bottom" : ""}`}
        >
            <div className="d-flex align-items-center">
                <div className="me-3 d-flex flex-column justify-content-center">
                    <span className="fw-semibold">{task.title}</span>
                    <span style={{ fontSize: "0.6em" }}>{formattedDate}</span>
                </div>
                {filterTaskDisplay ? (
                    <span className="badge text-bg-success py-2 px-3">
                        Terminé <i className="bi bi-check-lg"></i>
                    </span>
                ) : (
                    <span className="badge text-bg-light py-2 px-3">
                        En cours <i className="bi bi-hourglass-split"></i>
                    </span>
                )}
            </div>
        </li>
    );
};

const BodyListTask = ({ task, index }) => {
    return (
        <li
            className={`list-group ${
                index % 2 === 0 ? "bg-light" : ""
            } d-flex flex-row px-5 py-3 rounded-2`}
        >
            <Input
                className="form-check-input me-3"
                type="checkbox"
                checked={task.checked}
                onChange={() => null}
                id={task.id}
            />
            <Label
                className={`form-check-label ${
                    task.checked ? "text-decoration-line-through" : ""
                }`}
                htmlFor={task.id}
            >
                {task.name}
            </Label>
        </li>
    );
};

export default Body;
