"use strict";

import * as StorageManager from "./storage-manager.js";
export { populateInitialUi, updateListUi };

function populateInitialUi(
  onClickSwap,
  onClickNewDailyButton,
  onClickNewTodoButton,
  cleanCompletedItems
) {
  const darkModeClass = "dark";
  const lightModeClass = "light";
  const root = document.documentElement;
  const theme = StorageManager.getColorTheme();
  root.className = theme;
  const themeButton = document.querySelector("#color-theme-toggle");
  themeButton.className = theme;

  themeButton.addEventListener("click", (event) => {
    if (event.target.className === darkModeClass) {
      event.target.className = lightModeClass;
      root.className = lightModeClass;
      StorageManager.setColorTheme(lightModeClass);
    } else {
      event.target.className = darkModeClass;
      root.className = darkModeClass;
      StorageManager.setColorTheme(darkModeClass);
    }
  });

  const swapButton = document.querySelector("#swap-list");
  const swapListDialog = document.querySelector(".swapListDialog");
  swapButton.addEventListener("click", () => {
    swapListDialog.showModal();
  });
  document
    .querySelector(".swapListDialog button")
    .addEventListener("click", () => {
      onClickSwap();
      document.querySelector(".swapListDialog").close();
    });

  const cleanButton = document.querySelector("#clean-list");
  cleanButton.addEventListener("click", () => {
    cleanCompletedItems(
      document.querySelector(".secondary-list").getAttribute("data-id")
    );
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
  } else {
    document.querySelector(".dailies").setAttribute("data-id", list.id);
  }

  // This makes the function work for both dailies and non-dailies lists.
  const listNode = document.querySelector('div[data-id="' + list.id + '"] ul');
  listNode.replaceChildren();
  for (const todo of list.todos) {
    // TODO: this is going to need some tweaks to support reordering
    listNode.appendChild(createNewTodoUi(todo));
  }
}

function createNewTodoUi(todo) {
  const todoDiv = document.createElement("div");
  todo.completed
    ? (todoDiv.className = "todo-item-completed")
    : (todoDiv.className = "todo-item");
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
