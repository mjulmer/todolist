"use strict";

import "./styles.css";
import { TodoItem, TodoList } from "./todo-classes.js";
import { populateInitialUi, updateListUi } from "./dom-manager.js";

// The dailies list is "special" and not included here. This only includes
// lists that can be swapped out in the right panel.
// Lists are keyed by their ID
const lists = {};

populateInitialUi(
  (todoName) => {
    dailiesList.addItem(todoName);
    updateListUi(dailiesList);
  },
  (listId, todoName, todoDescription) => {
    lists[listId].addItem(todoName, todoDescription);
    updateListUi(lists[listId]);
  }
);

const dailiesList = new TodoList("Dailies", "dailies");
dailiesList.addItem("anki");
dailiesList.addItem("brush teeth");

const defaultList = new TodoList("Default", "dropzone");
defaultList.addItem("bake bread");
defaultList.addItem("email Pat", "ask for bean recipes");
lists["dropzone"] = defaultList;

updateListUi(dailiesList);
updateListUi(defaultList);
