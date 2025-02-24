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
    (listId, todoName, todoDescription) => {
      lists[listId].addItem(todoName, todoDescription);
      StorageManager.updateList(lists[listId]);
      domManager.updateListUi(lists[listId]);
    }
  );
  domManager.setCleanButtonClickHandler((listId) => {
    lists[listId].removeCompletedItems();
    StorageManager.updateList(lists[listId]);
    domManager.updateListUi(lists[listId]);
  });
  domManager.setEditButtonClickHandler(lists);
  domManager.initializeListSidebar(lists);
}

// For development, so it's easy to restore a "played-with" state
// after deleting local storage during testing
function initializeWithTrainingWheelsCode() {
  dailiesList = new TodoList("Dailies", dailiesId);
  dailiesList.addItem("anki");
  dailiesList.addItem("brush teeth");

  const defaultList = new TodoList("Default", "dropzone");
  defaultList.addItem("bake bread");
  defaultList.addItem("email Pat", "ask for bean recipes");
  lists["dropzone"] = defaultList;

  // TODO: Fix issue where text doesn't "unwrap" when its container has room
  const projectList = new TodoList("Todo project", "1");
  projectList.addItem("(P1) Add ability to delete items");
  projectList.addItem("(P1) Support showing description for non-daily itmes");
  projectList.addItem("(P1) add ability for users to add new lists");
  projectList.addItem("(P3) app priority system");
  projectList.addItem("(P3) add ability to reorder items");
  projectList.addItem("(P1) Implement 'edit list' button");
  lists[projectList.id] = projectList;

  StorageManager.updateListofListIds(lists);
  StorageManager.updateList(defaultList);
  StorageManager.updateList(dailiesList);
  StorageManager.updateList(projectList);

  console.log(StorageManager.getList(defaultList.id));
}
