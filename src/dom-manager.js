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
  todoDiv.className = "todo-item todo-item-" + todo.id;

  const title = document.createElement("p");
  title.textContent = todo.name;

  todoDiv.appendChild(title);
  return todoDiv;
}
