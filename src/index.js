"use strict";

import "./styles.css";
import { TodoList } from "./todo-classes.js";
import { DomManager } from "./dom-manager.js";
import * as StorageManager from "./storage-manager.js";

const dailiesId = "dailies";
let dailiesList;
// The dailies list is "special" and not included here. This only includes
// lists that can be swapped out in the right panel.
// Lists are keyed by their ID
const lists = {};
let listIds = 1;
const domManager = new DomManager(
  (list) => {
    StorageManager.updateList(list);
  },
  (listId, todoId) => {
    lists[listId].removeItem(todoId);
    StorageManager.updateList(lists[listId]);
    domManager.updateListUi(lists[listId]);
  }
);

if (!initializeStateFromStorage()) {
  initializeFirstTimeState();
}
initializeUi();

function initializeStateFromStorage() {
  if (!StorageManager.isStoragePopulated) {
    return false;
  }
  const listIds = StorageManager.getListIds();
  if (!listIds) {
    return false;
  }

  for (const listId of listIds) {
    const list = StorageManager.getList(listId);
    if (list) {
      lists[listId] = list;
      domManager.updateListUi(list);
    }
  }
  dailiesList = StorageManager.getList(dailiesId);
  domManager.updateListUi(dailiesList);
  return true;
}

/** If local storage is empty, show new user UI. */
function initializeFirstTimeState() {
  dailiesList = new TodoList("Dailies", dailiesId);
  const defaultList = new TodoList("Default", "dropzone");
  lists["dropzone"] = defaultList;
  domManager.updateListUi(dailiesList);
  domManager.updateListUi(defaultList);
}

function initializeUi() {
  domManager.setColorTheme(StorageManager.getColorTheme(), (theme) =>
    StorageManager.setColorTheme(theme)
  );
  domManager.register;
  domManager.setNewItemClickHandlers(
    (todoName) => {
      dailiesList.addItem(todoName);
      StorageManager.updateList(dailiesList);
      domManager.updateListUi(dailiesList);
    },
    (listId, todoName, todoDescription, dueDate, priority) => {
      lists[listId].addItem(todoName, todoDescription, dueDate, priority);
      StorageManager.updateList(lists[listId]);
      domManager.updateListUi(lists[listId]);
    }
  );
  domManager.setCleanButtonClickHandler((listId) => {
    lists[listId].removeCompletedItems();
    StorageManager.updateList(lists[listId]);
    domManager.updateListUi(lists[listId]);
  });
  domManager.setEditButtonClickHandler(lists, (listId) => {
    StorageManager.updateList(lists[listId]);
    domManager.updateListUi(lists[listId]);
  });
  domManager.initializeListSidebar(lists, (listName) => {
    const newListId = ++listIds;
    const newList = new TodoList(listName, newListId);
    lists[newListId] = newList;
    StorageManager.updateListofListIds(lists);
    StorageManager.updateList(newList);
    domManager.updateListUi(newList);
  });
  domManager.setExpandedTodoSaveChangesButtonClickHandler(
    lists,
    dailiesList,
    (todoId, listId, todoName, todoDescription, dueDate, priority) => {
      const list = listId == dailiesId ? dailiesList : lists[listId];
      const todo = list["todos"][todoId];
      todo.name = todoName;
      todo.description = todoDescription;
      todo.dueDate = dueDate;
      todo.priority = priority;
      StorageManager.updateList(list);
      domManager.updateListUi(list);
    }
  );
}
