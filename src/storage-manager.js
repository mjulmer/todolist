"use strict";

import { TodoItem, TodoList } from "./todo-classes.js";

export {
  isStoragePopulated,
  getColorTheme,
  setColorTheme,
  getListIds,
  getList,
  updateListofListIds,
  updateList,
};

/**
 * Contains functions for managing writing to and from local storage.
 *
 * Storage key schema:
 *
 * colorTheme: The preferred color theme, "light" or "dark".
 * listIds: A list of the IDs of all of the non-dailies lists or "projects".
 * list-$listId: List metadata (e.g. name, next todo ID, list of todos) for the
 *    list with the specified ID.
 */

const colorThemeKey = "colorTheme";
const listIdsKey = "listIds";
const listKeyPrefix = "list-";

function isStoragePopulated() {
  return localStorage.getItem(colorThemeKey) !== null;
}

/** Gets the current color theme from saved preferences.
 *
 * Potential return values are "dark" and "light". Returns "dark" if no theme
 * found; safe to call even if storage isn't populated.
 */
function getColorTheme() {
  const theme = localStorage.getItem(colorThemeKey);
  if (theme === null) {
    return "dark";
  }
  return theme;
}

function setColorTheme(theme) {
  if (theme !== "light" && theme !== "dark") {
    console.error(`Tried to store invalid value ${theme} for color theme`);
    return;
  }
  localStorage.setItem(colorThemeKey, theme);
}

/** Returns a list of all list IDs. Does not include the dailies list. */
function getListIds() {
  return JSON.parse(localStorage.getItem(listIdsKey));
}

/** Returns a "fully hydrated" list item containing todos and metadata.*/
function getList(listId) {
  return parseTodoListFromJson(
    JSON.parse(localStorage.getItem(listKeyPrefix + listId))
  );
}

/** Takes an object containing all lists (not including the dailies list)
 * and updates the list of list IDs in local storage.
 */
function updateListofListIds(lists) {
  localStorage.setItem(listIdsKey, JSON.stringify(Object.keys(lists)));
}

/** Update the list representation in storage.
 *
 * This should be called on any update to the list, including changes
 * to individual todos (like a change in their completion status).
 */
function updateList(list) {
  localStorage.setItem(listKeyPrefix + list.id, JSON.stringify(list));
}

function parseTodoListFromJson(jsonObject) {
  const list = new TodoList(jsonObject.name, jsonObject.description);
  list.id = jsonObject.id;
  list.itemIdCount = jsonObject.itemIdCount;

  for (const todoIndex in jsonObject.todos) {
    list.todos[todoIndex] = parseTodoItemFromJson(jsonObject.todos[todoIndex]);
  }
  return list;
}

function parseTodoItemFromJson(jsonObject) {
  const todo = new TodoItem(
    jsonObject.id,
    jsonObject.name,
    jsonObject.description
  );
  todo.completed = jsonObject.completed;
  return todo;
}
