"use strict";

import "./styles.css";
import { TodoList } from "./todo-classes.js";
import { populateInitialUi, updateListUi } from "./dom-manager.js";
import * as StorageManager from "./storage-manager.js";

// The dailies list is "special" and not included here. This only includes
// lists that can be swapped out in the right panel.
// Lists are keyed by their ID
const lists = {};

populateInitialUi(
  () => {
    updateListUi(lists["1"]);
  },
  (todoName) => {
    dailiesList.addItem(todoName);
    StorageManager.updateList(dailiesList);
    updateListUi(dailiesList);
  },
  (listId, todoName, todoDescription) => {
    lists[listId].addItem(todoName, todoDescription);
    StorageManager.updateList(lists[listId]);
    updateListUi(lists[listId]);
  },
  (listId) => {
    lists[listId].removeCompletedItems();
    StorageManager.updateList(lists[listId]);
    updateListUi(lists[listId]);
  }
);

if (!initializeStateFromStorage()) {
  initializeFirstTimeState();
}

// initializeWithTrainingWheelsCode();

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
      updateListUi(list);
    }
  }
  updateListUi(StorageManager.getList("dailies"));
  return true;
}

/** If local storage is empty, show new user UI. */
function initializeFirstTimeState() {
  const dailiesList = new TodoList("Dailies", "dailies");
  const defaultList = new TodoList("Default", "dropzone");
  lists["dropzone"] = defaultList;
  updateListUi(dailiesList);
  updateListUi(defaultList);
}

// For development, so it's easy to restore a "played-with" state
// after deleting local storage during testing
function initializeWithTrainingWheelsCode() {
  const dailiesList = new TodoList("Dailies", "dailies");
  dailiesList.addItem("anki");
  dailiesList.addItem("brush teeth");

  const defaultList = new TodoList("Default", "dropzone");
  defaultList.addItem("bake bread");
  defaultList.addItem("email Pat", "ask for bean recipes");
  lists["dropzone"] = defaultList;

  // TODO: Fix issue where text doesn't "unwrap" when its container has room
  const projectList = new TodoList("Todo project", "1");
  projectList.addItem("(P1) add modal for new todo input");
  projectList.addItem("(P1) Support showing description for non-daily itmes");
  projectList.addItem("(P1) add ability for users to add new lists");
  projectList.addItem("(P3) app priority system");
  projectList.addItem("(P3) add ability to reorder items");
  lists["1"] = projectList;

  updateListUi(dailiesList);
  updateListUi(defaultList);

  StorageManager.updateListofListIds(lists);
  StorageManager.updateList(defaultList);
  StorageManager.updateList(dailiesList);
  StorageManager.updateList(projectList);

  console.log(StorageManager.getList(defaultList.id));
}
