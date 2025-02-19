"use strict";

import "./styles.css";
import { TodoItem, TodoList } from "./todo-classes.js";

const defaultList = new TodoList();
defaultList.addItem("bake bread");
defaultList.addItem("email Pat", "ask for bean recipes");

console.log(defaultList.todos);
