import React, { StrictMode, createContext, useContext, useState } from "react";
import Button from "./components/forms/button";
import Input from "./components/forms/input";
import Label from "./components/forms/label";
import useForm from "./hooks/useForm";
import { FormContext, useFormContext } from "./context/useFormContext";
import useTasks from "./models/tasks";

const datasContext = createContext(null);

/**
 *The section of the to do list
 */
function SectionTodoList() {
    return (
        <StrictMode>
            <section id='todolist'>
                <h1 className="mb-5 text-center shadow py-4 mb-5 bg-body-tertiary rounded">My task list...</h1>
                <TodoTable />
            </section>
        </StrictMode>
    );
}

/**
 * The contents of the to do list
 */
const TodoTable = () => {
    const { lists, setLists, handleSaveLists, handleUpdateTaskChecked } =
        useTasks();

    return (
        <>
            <datasContext.Provider
                value={{
                    lists,
                    setLists,
                    handleSaveLists,
                    handleUpdateTaskChecked,
                }}
            >
                <DisplayTaskCreationForm />
                {lists.map((list) => (
                    <TaskLists key={list.id} list={list} />
                ))}
            </datasContext.Provider>
        </>
    );
};

/**
 * The button that allows you to open the form and/or close it
 */
const DisplayTaskCreationForm = () => {
    const [isCreate, setIsCreate] = useState(false);

    const COLOR_BUTTON = isCreate ? "btn-danger" : "btn-primary";
    const TEXT_BUTTON = isCreate ? "Cancel" : "Create a Task";
    const DISPLAY_TASK_FORM = isCreate && (
        <TaskCreationForm setIsCreate={setIsCreate} />
    );

    return (
        <>
            <Button
                type="button"
                onClick={() => setIsCreate(!isCreate)}
                className={`btn ${COLOR_BUTTON} d-block m-auto mb-5`}
            >
                {TEXT_BUTTON}
            </Button>

            {DISPLAY_TASK_FORM}
        </>
    );
};

/**
 * The form of creating a task
 *
 * @param {boolean} setIsCreate True if the user opened the form, false if not
 */
const TaskCreationForm = ({ setIsCreate }) => {
    const { register, handleSubmit, errors, handleResetErrorField } = useForm();
    const { handleSaveLists } = useContext(datasContext);
    const [listsInputTask, setListsInputTask] = useState([{ id: `tasks_1` }]);

    /**
     * Embarrassment of data backup
     *
     * @param {object} formData Les données du formulaire
     */
    const onSubmit = (formData) => {
        handleSaveLists(formData, listsInputTask, setIsCreate);
    };

    const FORM_TITLE = "Creation of a new task";
    const TEXT_BUTTON = "Save the task";

    return (
        <form
            noValidate
            className="mb-5 border border-ligth rounded-2 p-5 position-relative"
            onSubmit={(e) => handleSubmit(e, onSubmit)}
        >
            <h2 className="position-absolute top-0 start-50 translate-middle bg-white px-4 border-start border-end">
                {FORM_TITLE}
            </h2>

            <FormContext.Provider
                value={{ register, errors, handleResetErrorField }}
            >
                <InputTitle />
                <InputsTaskLists
                    listsInputTask={listsInputTask}
                    setListsInputTask={setListsInputTask}
                />
            </FormContext.Provider>

            <Button
                type="submit"
                className="btn btn-success mt-5 d-block m-auto"
            >
                {TEXT_BUTTON}
            </Button>
        </form>
    );
};

/**
 * The Title field of creating a task
 */
const InputTitle = () => {
    const { register, errors, handleResetErrorField } = useFormContext();

    const FIELD_NAME = "title";
    const LABEL_TEXT = "Title";

    /**
     * Constant which embarrassments the state of the errors
     */
    const ERROR_MESSAGE = "The title field is compulsory";
    const NOT_EMPTY_ERROR = errors.title;
    const DISPLAY_ERRORS_TITLE = NOT_EMPTY_ERROR && (
        <div id="title" className="invalid-feedback">
            {errors.title}
        </div>
    );
    const DISPLAY_IS_VALID = NOT_EMPTY_ERROR ? "is-invalid" : "";

    return (
        <div className="mb-3">
            <Label htmlFor={FIELD_NAME} className="form-label fw-medium mb-0">
                {LABEL_TEXT}
            </Label>
            <Input
                {...register(FIELD_NAME, {
                    required: {
                        message: ERROR_MESSAGE,
                    },
                })}
                id={FIELD_NAME}
                className={`form-control ${DISPLAY_IS_VALID}`}
                type="text"
                onClick={() => {
                    handleResetErrorField(FIELD_NAME);
                }}
            />

            {DISPLAY_ERRORS_TITLE}
        </div>
    );
};

/**
 * The fields on the list of added tasks
 *
 * @param {function} listsInputTask The list of added fields
 * @param {function} setListsInputTask The function that allows you to add a field
 */
const InputsTaskLists = ({ listsInputTask, setListsInputTask }) => {
    const [countTasks, setCountTasks] = useState(1);

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
                    <InputTaskList
                        id={listInput.id}
                        handleDeleteTask={handleDeleteTask}
                    />
                </div>
            ))}
            <Button
                type="button"
                className="btn btn-outline-primary w-100 p-0"
                onClick={handleAddTasks}
            >
                <i className="bi bi-patch-plus-fill fs-4"></i>
            </Button>
        </div>
    );
};

/**
 * The fields of the list of tasks to be performed
 *
 * @param {number} id The identifier of the added task
 * @param {function} handleDeleteTask The deletion of the added input fields
 */
const InputTaskList = ({ id, handleDeleteTask }) => {
    const { register, errors, handleResetErrorField } = useFormContext();

    const LABEL_TEXT = "Tasks";

    /**
     * Constant which embarrasses the state of the first input of the list
     */
    const DISPLAY_LABEL = id === "tasks_1" && (
        <Label htmlFor={id} className="form-label fw-medium mb-0">
            {LABEL_TEXT}
        </Label>
    );
    const DISPLAY_BUTTON_DELETE = id !== "tasks_1" && (
        <Button
            type="button"
            className="btn btn-danger btn-sm me-2"
            onClick={() => handleDeleteTask(id)}
        >
            <i className="bi bi-trash"></i>
        </Button>
    );

    /**
     * Constant which embarrassments the state of the errors
     */
    const NOT_EMPTY_ERROR = errors[id];
    const ERROR_MESSAGE = "The task field is compulsory";
    const DISPLAY_ERRORS_LIST = NOT_EMPTY_ERROR && (
        <div id={id} className="invalid-feedback d-block">
            {NOT_EMPTY_ERROR}
        </div>
    );
    const DISPLAY_IS_VALID = NOT_EMPTY_ERROR ? "is-invalid" : "";

    return (
        <>
            {DISPLAY_LABEL}
            <div className="d-flex flex-row align-items-center">
                {DISPLAY_BUTTON_DELETE}

                <Input
                    {...register(id, {
                        required: {
                            message: ERROR_MESSAGE,
                        },
                    })}
                    id={id}
                    className={`form-control ${DISPLAY_IS_VALID}`}
                    type="text"
                    onClick={() => handleResetErrorField(id)}
                />
            </div>
            {DISPLAY_ERRORS_LIST}
        </>
    );
};

/**
 * The list of all tasks
 *
 * @param {object} list
 * @returns
 */
const TaskLists = ({ list }) => {
    return (
        <ul className="border border-ligth p-0 rounded-2 mx-3 mb-5">
            <HeaderTaskList list={list} />
            <li className="list-group">
                <ul className="p-0">
                    {list.tasks.map((task, index) => (
                        <BodyTaskList key={task.id} index={index} task={task} />
                    ))}
                </ul>
            </li>
        </ul>
    );
};

/**
 * The header of tasks
 *
 * @param {object} list
 */
const HeaderTaskList = ({ list }) => {
    /**
     * Management of the progress of the task list
     */
    const COUNT_TASK_CHECKED = list.tasks.filter((list) => list.checked).length;
    const FILTER_TASK_DISPLAY = COUNT_TASK_CHECKED === list.tasks.length;
    const PROGRESS_VALUE = Math.round(
        (100 / list.tasks.length) * COUNT_TASK_CHECKED
    );

    /**
     * Format of the date of creation of a task
     */
    const FORMATTED_DATE = list.created_at.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <li
            className={`list-group d-flex flex-row justify-content-between align-items-center p-3 rounded-0 border-ligth position-relative
            ${!FILTER_TASK_DISPLAY ? "border-bottom" : ""}`}
        >
            <TaskProgressBar progressValue={PROGRESS_VALUE} />

            <div className="d-flex align-items-center">
                <div className="me-3 d-flex flex-column justify-content-center">
                    <span className="fw-semibold">{list.title}</span>
                    <span style={{ fontSize: "0.6em" }}>{FORMATTED_DATE}</span>
                </div>
                <TaskProgressBadge progressValue={PROGRESS_VALUE} />
            </div>
        </li>
    );
};

/**
 * The task list
 *
 * @param {object} task
 */
const BodyTaskList = ({ task, index }) => {
    const { handleUpdateTaskChecked } = useContext(datasContext);

    const LIST_COLOR = index % 2 === 0 ? "bg-light" : "";
    const LINE_THROUGH_LABEL = task.checked
        ? "text-decoration-line-through"
        : "";

    return (
        <li
            className={`list-group ${LIST_COLOR} d-flex flex-row px-5 py-3 rounded-2`}
        >
            <Input
                className="form-check-input me-3"
                type="checkbox"
                checked={task.checked}
                onChange={handleUpdateTaskChecked}
                id={task.id}
            />
            <Label
                className={`form-check-label ${LINE_THROUGH_LABEL}`}
                htmlFor={task.id}
            >
                {task.name}
            </Label>
        </li>
    );
};

/**
 * The progression bar that determines the status of tasks
 *
 * @param {number} progressValue The level of progress of the list
 */
const TaskProgressBar = ({ progressValue }) => {
    /**
     * Information on the color and text of the progression
     */
    const { COLOR_BAR_PROGRESS } = __getStyleProgress(progressValue);

    /**
     * Progress bar data
     */
    const CURRENT_VALUE = progressValue;
    const VALUE_MIN = 0;
    const VALUE_MAX = 100;
    const TEXT_COLOR_PROGRESS = CURRENT_VALUE > 50 && "text-white";
    const VALUE_PROGRESS = CURRENT_VALUE + "%";
    const STYLE_PROGRESS_BAR_LENGTH = { width: CURRENT_VALUE + "%" };

    return (
        <div
            className="progress position-absolute top-0 start-50 translate-middle w-100"
            role="progressbar"
            aria-label="Task progression bar"
            aria-valuenow={CURRENT_VALUE}
            aria-valuemin={VALUE_MIN}
            aria-valuemax={VALUE_MAX}
        >
            <div
                className={`position-absolute top-50 start-50 translate-middle fw-bold ${TEXT_COLOR_PROGRESS}`}
            >
                {VALUE_PROGRESS}
            </div>
            <div
                className={`progress-bar ${COLOR_BAR_PROGRESS}`}
                style={STYLE_PROGRESS_BAR_LENGTH}
            ></div>
        </div>
    );
};

/**
 * The badge that determines the status of tasks
 *
 * @param {number} progressValue The level of progress of the list
 */
const TaskProgressBadge = ({ progressValue }) => {
    /**
     * Information on the color and text of the progression
     */
    const { COLOR_BAR_PROGRESS, TEXT_BUTTON_PROGRESS } =
        __getStyleProgress(progressValue);

    const IS_TASK_DONE = TEXT_BUTTON_PROGRESS === "Done" && (
        <i className="bi bi-check-lg"></i>
    );

    return (
        <span className={`badge text-${COLOR_BAR_PROGRESS} py-2 px-3`}>
            {TEXT_BUTTON_PROGRESS} {IS_TASK_DONE}
        </span>
    );
};

/**
 * Recovery of information bar information
 *
 * @param {number} progressValue The level of progress of the list
 *
 * @returns Information on the color and text of the progression
 */
const __getStyleProgress = (progressValue) => {
    let COLOR_BAR_PROGRESS = "bg-secondary";
    let TEXT_BUTTON_PROGRESS = "To Do";

    switch (true) {
        case progressValue > 0 && progressValue <= 35:
            TEXT_BUTTON_PROGRESS = "In Progress";
            COLOR_BAR_PROGRESS = "bg-danger";
            break;
        case progressValue > 35 && progressValue <= 99:
            TEXT_BUTTON_PROGRESS = "Almost Done";
            COLOR_BAR_PROGRESS = "bg-warning";
            break;
        case progressValue >= 99:
            TEXT_BUTTON_PROGRESS = "Done";
            COLOR_BAR_PROGRESS = "bg-success";
            break;
    }

    return { COLOR_BAR_PROGRESS, TEXT_BUTTON_PROGRESS };
};

export default SectionTodoList;
