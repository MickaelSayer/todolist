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
    const { datas, createTask, updateTaskChecked, fields, handleChangeFilter } =
        useTasks();

    return (
        <>
            <datasContext.Provider
                value={{
                    datas,
                    createTask,
                    updateTaskChecked,
                    fields,
                    handleChangeFilter,
                }}
            >
                <TaskCreationContainer />
                <FormFilter />
                {datas.map((task) => (
                    <ListsTasks key={task.id} task={task} />
                ))}
            </datasContext.Provider>
        </>
    );
};

const FormFilter = () => {
    const [openFilter, setOpenFilter] = useState(false);

    return (
        <>
            <Button
                className={`btn btn-light ms-3 rounded-0 ${
                    openFilter ? "mb-0 rounded-top" : "mb-5 rounded-2"
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
                    <SelectFilterDate />
                    <SelectFilterChecked />
                </div>
            )}
        </>
    );
};

const SelectFilterChecked = () => {
    const { fields, handleChangeFilter } = useContext(datasContext);
    const valueFilter = fields.lists.filter.defaultFilter;

    return (
        <div className="form-check form-switch">
            <span className="fw-medium">By the status of the task :</span>
            <Select
                className="form-select form-select-sm mb-3"
                aria-label="Select the filter for the order of the date"
                onChange={handleChangeFilter}
                value={valueFilter}
                name={fields.lists.filter.name}
                options={[
                    {
                        value: "allChecked",
                        defaultValue: valueFilter === "allChecked",
                        name: "All tasks",
                        key: "allChecked",
                    },
                    {
                        value: "checked",
                        defaultValue: valueFilter === "checked",
                        name: "tasks checked",
                        key: "checked",
                    },
                    {
                        value: "noChecked",
                        defaultValue: valueFilter === "noChecked",
                        value: "noChecked",
                        name: "tasks unchecked",
                        key: "noChecked",
                    },
                ]}
            />
        </div>
    );
};

const SelectFilterDate = () => {
    const { fields, handleChangeFilter } = useContext(datasContext);
    const valueFilter = fields.created_at.filter.defaultFilter;

    return (
        <div className="form-check form-switch">
            <span className="fw-medium">By date :</span>
            <Select
                className="form-select form-select-sm mb-3"
                aria-label="Select the filter for the order of the date"
                onChange={handleChangeFilter}
                value={valueFilter}
                name={fields.created_at.filter.name}
                options={[
                    {
                        value: "desc",
                        defaultValue: valueFilter === "desc",
                        name: "Descending",
                        key: "descending",
                    },
                    {
                        value: "asc",
                        defaultValue: valueFilter === "asc",
                        name: "Ascending",
                        key: "ascending",
                    },
                ]}
            />
        </div>
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
    const { datas, createTask, fields } = useContext(datasContext);
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

        createTask(fields, {
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
    const { fields } = useContext(datasContext);

    const shouldRenderList = (list) => {
        return (
            (fields.lists.filter.defaultFilter === "noChecked" &&
                !list.checked) ||
            (fields.lists.filter.defaultFilter === "checked" && list.checked) ||
            fields.lists.filter.defaultFilter === "allChecked"
        );
    };

    return (
        <ul className="border border-ligth p-0 rounded-2 mx-3 mb-5">
            <HeaderListTask task={task} />
            <li className="list-group">
                <ul className="p-0">
                    {task.lists.map((list, index) => {
                        return (
                            shouldRenderList(list) && (
                                <BodyListTask
                                    key={list.id}
                                    index={index}
                                    task={list}
                                />
                            )
                        );
                    })}
                </ul>
            </li>
        </ul>
    );
};

const HeaderListTask = ({ task }) => {
    const countTaskChecked = task.lists.filter((list) => list.checked).length;
    const filterTaskDisplay = countTaskChecked === task.lists.length;

    const progressValue = Math.round(
        (100 / task.lists.length) * countTaskChecked
    );
    const colorBarProgress =
        progressValue === 0
            ? "bg-secondary"
            : progressValue > 0 && progressValue < 35
            ? "bg-danger"
            : progressValue > 35 && progressValue < 70
            ? "bg-warning"
            : progressValue > 70 && "bg-success";

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = task.created_at.toLocaleDateString("fr-FR", options);

    return (
        <li
            className={`list-group d-flex flex-row justify-content-between align-items-center p-3 rounded-0 border-ligth position-relative
            ${!filterTaskDisplay ? "border-bottom" : ""}`}
        >
            <TaskProgressBar
                progressValue={progressValue}
                colorBarProgress={colorBarProgress}
            />

            <div className="d-flex align-items-center">
                <div className="me-3 d-flex flex-column justify-content-center">
                    <span className="fw-semibold">{task.title}</span>
                    <span style={{ fontSize: "0.6em" }}>{formattedDate}</span>
                </div>
                <TaskProgressBadge
                    filterTaskDisplay={filterTaskDisplay}
                    colorBarProgress={colorBarProgress}
                />
            </div>
        </li>
    );
};

const BodyListTask = ({ task, index }) => {
    const { updateTaskChecked } = useContext(datasContext);

    const handleUpdateTaskChecked = () => {
        updateTaskChecked(task.id);
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
                checked={task.checked}
                onChange={handleUpdateTaskChecked}
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

const TaskProgressBar = ({ progressValue, colorBarProgress }) => {
    return (
        <div
            className="progress position-absolute top-0 start-50 translate-middle w-100"
            role="progressbar"
            aria-label="Barre de progression de la tâche"
            aria-valuenow={progressValue}
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <div
                className={`position-absolute top-50 start-50 translate-middle fw-bold ${
                    progressValue > 50 && "text-white"
                }`}
            >
                {progressValue}%
            </div>
            <div
                className={`progress-bar ${colorBarProgress}`}
                style={{ width: progressValue + "%" }}
            ></div>
        </div>
    );
};

const TaskProgressBadge = ({ filterTaskDisplay, colorBarProgress }) => {
    let content = null;

    filterTaskDisplay
        ? (content = (
              <span className={`badge text-${colorBarProgress} py-2 px-3`}>
                  Terminé <i className="bi bi-check-lg"></i>
              </span>
          ))
        : (content = (
              <span className={`badge text-${colorBarProgress} py-2 px-3`}>
                  En cours <i className="bi bi-hourglass-split"></i>
              </span>
          ));

    return content;
};

export default Body;
