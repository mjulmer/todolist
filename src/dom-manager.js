"use strict";

export { DomManager };

class DomManager {
  updateListCallback;
  removeItemCallback;

  constructor(updateListCallback, removeItemCallback) {
    this.updateListCallback = updateListCallback;
    this.removeItemCallback = removeItemCallback;
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
        document.querySelector("#todoDescription").value
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

  setEditButtonClickHandler(lists) {
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
      } else {
        editButton.className = "selected";
        const listNameInput = document.createElement("input");
        const listLabel = document.querySelector("#secondary-list-label");
        listNameInput.setAttribute("placeholder", listLabel.textContent);
        listLabelContainer.replaceChild(listNameInput, listLabel);

        // TODO: adding a new item in edit mode makes them disappear again?
        const deleteButtons = document.querySelectorAll(
          ".secondary-list .todo-delete-button"
        );
        for (const button of deleteButtons) {
          button.removeAttribute("hidden");
        }
      }
    });
  }

  initializeListSidebar(lists) {
    const listUl = document.querySelector(".sidebar ul");
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
      log.error("updateListUi called on undefined list.");
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
      // TODO: implement logic to remove the todo
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
}
