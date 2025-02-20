"use strict";

import "./styles.css";
import { TodoItem, TodoList } from "./todo-classes.js";
import { populateInitialUi, updateListUi } from "./dom-manager.js";

populateInitialUi();

const dailiesList = new TodoList("Dailies", "dailies");
dailiesList.addItem("anki");
dailiesList.addItem("brush teeth");

const defaultList = new TodoList("Default", "dropzone");
defaultList.addItem("bake bread");
defaultList.addItem("email Pat", "ask for bean recipes");

updateListUi(dailiesList, () => {
  dailiesList.addItem("new item");
  updateListUi(dailiesList);
});
updateListUi(defaultList, () => {
  defaultList.addItem("new item 2");
  updateListUi(defaultList);
});
