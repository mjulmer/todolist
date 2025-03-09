"use strict";

import { da } from "date-fns/locale";
import { ModalWithScrim } from "./modal-with-scrim.js";
export { DomManager };

class DomManager {
  updateListCallback;
  removeItemCallback;
  modalWithScrim;

  constructor(updateListCallback, removeItemCallback) {
    this.updateListCallback = updateListCallback;
    this.removeItemCallback = removeItemCallback;
    this.modalWithScrim = new ModalWithScrim();
  }

  setColorTheme(theme, onThemeChange) {
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

  setNewItemClickHandlers(onClickNewDailyButton, onClickNewTodoButton) {
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
        document.querySelector("#todoDescription").value,
        document.querySelector("#todoDate").value,
        document.querySelector("#todoPriority").value
      );
      document.querySelector(".newTodoDialog").close();
    });
  }

  setCleanButtonClickHandler(cleanCompletedItems) {
    const cleanButton = document.querySelector("#clean-list");
    cleanButton.addEventListener("click", () => {
      cleanCompletedItems(
        document.querySelector(".secondary-list").getAttribute("data-id")
      );
    });
  }

  setEditButtonClickHandler(lists, onListChange) {
    const listLabelContainer = document.querySelector(
      ".secondary-list .list-options"
    );
    const editButton = document.querySelector("#edit-list");
    editButton.addEventListener("click", () => {
      if (editButton.className === "selected") {
        editButton.className = "unselected";
        const listNameInput = document.querySelector(".secondary-list input");
        const textLabel = document.createElement("span");
        textLabel.id = "secondary-list-label";
        textLabel.className = "list-label";
        // TODO -- less likely to introduce bugs if you just reuse the actual
        // name from the list rather than passing around these text labels
        textLabel.textContent =
          listNameInput.value === ""
            ? listNameInput.getAttribute("placeholder")
            : listNameInput.value;
        listLabelContainer.replaceChild(textLabel, listNameInput);

        const deleteButtons = document.querySelectorAll(
          ".secondary-list .todo-delete-button"
        );
        for (const button of deleteButtons) {
          button.setAttribute("hidden", "");
        }

        onListChange(
          document.querySelector(".secondary-list").getAttribute("data-id")
        );
      } else {
        editButton.className = "selected";
        const listNameInput = document.createElement("input");
        const listLabel = document.querySelector("#secondary-list-label");
        listNameInput.setAttribute("placeholder", listLabel.textContent);
        listLabelContainer.replaceChild(listNameInput, listLabel);

        const deleteButtons = document.querySelectorAll(
          ".secondary-list .todo-delete-button"
        );
        for (const button of deleteButtons) {
          button.removeAttribute("hidden");
        }
      }
    });
  }

  setExpandedTodoSaveChangesButtonClickHandler(
    lists,
    dailies,
    onClickSaveChanges
  ) {
    document
      .querySelector("#edit-todo-submit")
      .addEventListener("click", (event) => {
        event.preventDefault();

        const todoId = document
          .querySelector("#expanded-edit-mode")
          .getAttribute("data-todo-id");
        const listId = document
          .querySelector("#expanded-edit-mode")
          .getAttribute("data-list-id");
        const list = listId == dailies.id ? dailies : lists[listId];

        onClickSaveChanges(
          todoId,
          listId,
          document.querySelector("#editTodoName").value,
          document.querySelector("#editTodoDescription").value,
          document.querySelector("#editTodoDate").value,
          document.querySelector("#editTodoPriority").value
        );
        this.modalWithScrim.showModal(
          this.getExpandedTodoView(list["todos"][todoId], list)
        );
      });
  }

  initializeListSidebar(lists, onClickNewList) {
    this.updateListsInSidebar(lists);

    document.querySelector(".new-list-button").addEventListener("click", () => {
      document.querySelector("#new-list-form").reset();
      document.querySelector(".newListDialog").showModal();
    });
    document
      .querySelector("#new-list-submit")
      .addEventListener("click", (event) => {
        event.preventDefault();

        onClickNewList(document.querySelector("#listName").value);
        this.updateListsInSidebar(lists);
        document.querySelector(".newListDialog").close();
      });
  }

  updateListsInSidebar(lists) {
    const listUl = document.querySelector(".sidebar ul");
    listUl.replaceChildren();
    for (const list in lists) {
      const listElement = document.createElement("button");
      listElement.textContent = lists[list].name;
      listElement.setAttribute("data-id", lists[list].id);
      listElement.addEventListener("click", () => {
        this.updateListUi(lists[list]);
      });
      listUl.appendChild(listElement);
    }
  }

  updateListUi(list) {
    if (list === undefined) {
      console.error("updateListUi called on undefined list.");
      return;
    }
    if (list.id !== "dailies") {
      const label = document.querySelector("#secondary-list-label");
      // The label will not be present in edit mode, and will be updated
      // when the user leaves edit mode.
      if (label !== null) {
        label.textContent = list.name;
      }
      document
        .querySelector(".secondary-list")
        .setAttribute("data-id", list.id);

      // On list updates after the first render, change the list title
      // in the sidebar if needed.
      const listSidebarButton = document.querySelector(
        '.sidebar ul button[data-id="' + String(list.id) + '"]'
      );
      if (listSidebarButton != null) {
        listSidebarButton.textContent = list.name;
      }
    } else {
      document.querySelector(".dailies").setAttribute("data-id", list.id);
    }

    // This makes the function work for both dailies and non-dailies lists.
    const listNode = document.querySelector(
      'div[data-id="' + list.id + '"] ul'
    );
    listNode.replaceChildren();
    for (const todoId in list.todos) {
      // TODO: this is going to need some tweaks to support reordering
      listNode.appendChild(this.createNewTodoUi(list.todos[todoId], list));
    }
  }

  createNewTodoUi(todo, list) {
    const todoDiv = document.createElement("div");
    todo.completed
      ? (todoDiv.className = "todo-item-completed")
      : (todoDiv.className = "todo-item");
    todoDiv.id = "todo-item-" + todo.id;

    const completedButton = document.createElement("button");
    completedButton.className = "todo-button";
    completedButton.addEventListener("click", (event) =>
      this.onTodoClick(event, todo, list)
    );

    const title = document.createElement("span");
    title.textContent = todo.name;
    // TODO: check if this will work if the todo state mutates, or if it needs
    // a new lists object from index.js and a set todo ID to look up
    title.addEventListener("click", () => {
      this.modalWithScrim.showModal(this.getExpandedTodoView(todo, list));
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-delete-button";
    const isInEditMode =
      document.querySelector("#edit-list").className === "selected";
    const currDisplayedListId = document
      .querySelector(".secondary-list")
      .getAttribute("data-id");
    if (!isInEditMode || list.id !== currDisplayedListId) {
      deleteButton.setAttribute("hidden", "");
    }
    deleteButton.addEventListener("click", () => {
      this.removeItemCallback(list.id, todo.id);
    });

    todoDiv.appendChild(completedButton);
    todoDiv.appendChild(title);
    todoDiv.appendChild(deleteButton);
    return todoDiv;
  }

  onTodoClick(event, todo, list) {
    const todoDiv = event.target.parentElement;
    todoDiv.className === "todo-item"
      ? (todoDiv.className = "todo-item-completed")
      : (todoDiv.className = "todo-item");
    todo.completed = !todo.completed;
    this.updateListCallback(list);
  }

  getExpandedTodoView(todo, list) {
    const todoContainer = document.querySelector("#expanded-view-mode");
    // todoContainer.setAttribute("data-id", todo.id);
    const title = document.querySelector(".expandedTodoTitle");
    title.textContent = todo.name;

    const description = document.querySelector(".expandedTodoDescription");
    description.textContent = todo.description;

    const dueDate = document.querySelector(".dueDate");
    if (todo.dueDate === undefined || todo.dueDate === "") {
      dueDate.textContent = "No due date set.";
    } else {
      dueDate.textContent = "Due: " + todo.dueDate;
    }

    // TODO: might want to change whether text is displayed when there's no
    // priority if dailies never have a priority; that's a product call.
    const priority = document.querySelector(".priority");
    if (todo.priority === undefined || todo.priority === "") {
      priority.textContent = "No priority set.";
    } else {
      priority.textContent = "P" + todo.priority;
    }

    document.querySelector("#edit-item").addEventListener("click", () => {
      this.modalWithScrim.showModal(this.getEditTodoView(todo, list));
    });

    // If the click bubbles up to the scrim, the modal/scrim will be hidden.
    todoContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    return todoContainer;
  }

  getEditTodoView(todo, list) {
    const todoContainer = document.querySelector("#expanded-edit-mode");
    todoContainer.setAttribute("data-list-id", list.id);
    todoContainer.setAttribute("data-todo-id", todo.id);
    const title = document.querySelector("#editTodoName");
    title.value = todo.name;

    const description = document.querySelector("#editTodoDescription");
    description.value = todo.description == undefined ? "" : todo.description;

    const dueDate = document.querySelector("#editTodoDate");
    dueDate.value = todo.dueDate;

    const priority = document.querySelector("#editTodoPriority");
    priority.value = todo.priority;

    // Since the click handler requires changes to the data model, it's registered
    // with a callback and should alreay be attached.

    // If the click bubbles up to the scrim, the modal/scrim will be hidden.
    todoContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    return todoContainer;
  }
}
