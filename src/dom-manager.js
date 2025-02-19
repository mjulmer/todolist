"use strict";

export { updateListUi };

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
