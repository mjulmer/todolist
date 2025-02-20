"use strict";

export { populateInitialUi, updateListUi };

function populateInitialUi() {
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
}

function updateListUi(list) {
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
