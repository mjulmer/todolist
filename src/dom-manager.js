"use strict";

import * as StorageManager from "./storage-manager.js";
export {
  setColorTheme,
  setNewItemClickHandlers,
  setCleanButtonClickHandler,
  updateListUi,
  initializeListSidebar,
};

function setColorTheme(theme, onThemeChange) {
  const darkModeClass = "dark";
  const lightModeClass = "light";
  const root = document.documentElement;
  root.className = theme;
  const themeButton = document.querySelector("#color-theme-toggle");
  themeButton.className = theme;

  themeButton.addEventListener("click", (event) => {
    if (event.target.className === darkModeClass) {
      event.target.className = lightModeClass;
      root.className = lightModeClass;
      onThemeChange(lightModeClass);
    } else {
      event.target.className = darkModeClass;
      root.className = darkModeClass;
      onThemeChange(darkModeClass);
    }
  });
}

function setNewItemClickHandlers(onClickNewDailyButton, onClickNewTodoButton) {
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

function setCleanButtonClickHandler(cleanCompletedItems) {
  const cleanButton = document.querySelector("#clean-list");
  cleanButton.addEventListener("click", () => {
    cleanCompletedItems(
      document.querySelector(".secondary-list").getAttribute("data-id")
    );
  });
}

function initializeListSidebar(lists) {
  const listUl = document.querySelector(".sidebar ul");
  for (const list in lists) {
    const listElement = document.createElement("button");
    listElement.textContent = lists[list].name;
    listElement.setAttribute("data-id", lists[list].id);
    listElement.addEventListener("click", () => {
      updateListUi(lists[list]);
    });
    listUl.appendChild(listElement);
  }
}

function updateListUi(list) {
  if (list === undefined) {
    log.error("updateListUi called on undefined list.");
    return;
  }
  if (list.id !== "dailies") {
    const label = document.querySelector("#secondary-list-label");
    label.textContent = list.name;
    document.querySelector(".secondary-list").setAttribute("data-id", list.id);
  } else {
    document.querySelector(".dailies").setAttribute("data-id", list.id);
  }

  // This makes the function work for both dailies and non-dailies lists.
  const listNode = document.querySelector('div[data-id="' + list.id + '"] ul');
  listNode.replaceChildren();
  for (const todo of list.todos) {
    // TODO: this is going to need some tweaks to support reordering
    listNode.appendChild(createNewTodoUi(todo, list));
  }
}

function createNewTodoUi(todo, list) {
  const todoDiv = document.createElement("div");
  todo.completed
    ? (todoDiv.className = "todo-item-completed")
    : (todoDiv.className = "todo-item");
  todoDiv.id = "todo-item-" + todo.id;

  const completedButton = document.createElement("button");
  completedButton.className = "todo-button";
  completedButton.addEventListener("click", (event) =>
    onTodoClick(event, todo, list)
  );

  const title = document.createElement("span");
  title.textContent = todo.name;

  todoDiv.appendChild(completedButton);
  todoDiv.appendChild(title);
  return todoDiv;
}

function onTodoClick(event, todo, list) {
  const todoDiv = event.target.parentElement;
  todoDiv.className === "todo-item"
    ? (todoDiv.className = "todo-item-completed")
    : (todoDiv.className = "todo-item");
  todo.completed = !todo.completed;
  // I know this is gross and bad and poor separation of concerns :(
  // If I had stored the todos separately from the start (in the "database"),
  // then I at LEAST wouldn't have to pass the list through to here.
  StorageManager.updateList(list);
}
