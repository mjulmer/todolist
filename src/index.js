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

updateListUi(dailiesList);
updateListUi(defaultList);
