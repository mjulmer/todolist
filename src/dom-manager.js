"use strict";

export { populateInitialUi, updateListUi };

function populateInitialUi(onClickNewDailyButton, onClickNewTodoButton) {
  // In practice, this would be read from settings / cookie / browser default.
  // But this is a personal project and the functionality I really want is
  // "don't blind me when I'm coding at night but also support light mode that
  // doesn't turn off every refresh". So...
  // TODO: read this as a preference once suporting local storage
  const darkModeClass = "dark";
  const lightModeClass = "light";
  const isDarkModeDefault = true;
  const root = document.documentElement;
  root.className = isDarkModeDefault ? darkModeClass : lightModeClass;
  const themeButton = document.querySelector("#color-theme-toggle");
  themeButton.className = darkModeClass;

  themeButton.addEventListener("click", (event) => {
    event.target.className === darkModeClass
      ? (event.target.className = lightModeClass)
      : (event.target.className = darkModeClass);
    root.className =
      root.className === darkModeClass ? lightModeClass : darkModeClass;
  });

  const newDailyButton = document.querySelector(".dailies .new-todo-button");
  const newDailyDialog = document.querySelector(".newDailyDialog");
  newDailyButton.addEventListener("click", () => {
    document.querySelector("#new-daily-form").reset();
    newDailyDialog.showModal();
  });

  const newTodoButton = document.querySelector(
    ".secondary-list .new-todo-button"
  );
  const newTodoDialog = document.querySelector(".newTodoDialog");
  newTodoButton.addEventListener("click", () => {
    document.querySelector("#new-todo-form").reset();
    newTodoDialog.showModal();
  });

  const newDailySubmitButton = document.querySelector("#new-daily-submit");
  newDailySubmitButton.addEventListener("click", (event) => {
    event.preventDefault();

    onClickNewDailyButton(document.querySelector("#dailyName").value);
    document.querySelector(".newDailyDialog").close();
  });

  const newTodoSubmitButton = document.querySelector("#new-todo-submit");
  newTodoSubmitButton.addEventListener("click", (event) => {
    event.preventDefault();

    onClickNewTodoButton(
      document.querySelector(".secondary-list").getAttribute("data-id"),
      document.querySelector("#todoName").value,
      document.querySelector("#todoDescription").value
    );
    document.querySelector(".newTodoDialog").close();
  });
}

function updateListUi(list) {
  if (list.id !== "dailies") {
    const label = document.querySelector("#secondary-list-label");
    label.textContent = list.name;
    document.querySelector(".secondary-list").setAttribute("data-id", list.id);
    document.querySelector(".secondary-list ul").id = "list-" + list.id;
  }

  // This makes the function work for both dailies and non-dailies lists.
  const listNode = document.querySelector("#list-" + list.id);
  listNode.replaceChildren();
  for (const todo of list.todos) {
    // TODO: this is going to need some tweaks to support reordering
    listNode.appendChild(createNewTodoUi(todo));
  }
}

function createNewTodoUi(todo) {
  const todoDiv = document.createElement("div");
  todoDiv.className = "todo-item";
  todoDiv.id = "todo-item-" + todo.id;

  const completedButton = document.createElement("button");
  completedButton.className = "todo-button";
  completedButton.addEventListener("click", (event) =>
    onTodoClick(event, todo)
  );

  const title = document.createElement("span");
  title.textContent = todo.name;

  todoDiv.appendChild(completedButton);
  todoDiv.appendChild(title);
  return todoDiv;
}

function onTodoClick(event, todo) {
  const todoDiv = event.target.parentElement;
  todoDiv.className === "todo-item"
    ? (todoDiv.className = "todo-item-completed")
    : (todoDiv.className = "todo-item");
  todo.completed = !todo.completed;
}
