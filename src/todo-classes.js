export { TodoItem, TodoList, parseTodoListFromJson };

class TodoItem {
  id;
  name;
  description;
  completed = false;

  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

class TodoList {
  name = "";
  id;
  todos = [];
  itemIdCount = 0;

  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  addItem(name, description) {
    this.todos.push(new TodoItem(this.itemIdCount++, name, description));
  }

  removeItem(id) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == id) {
        this.todos.splice(i, 1);
      }
    }
  }
}

function parseTodoListFromJson(jsonObject) {
  const list = new TodoList(jsonObject.name, jsonObject.description);
  list.id = jsonObject.id;
  list.itemIdCount = jsonObject.itemIdCount;

  for (const todoIndex in jsonObject.todos) {
    list.todos.push(parseTodoItemFromJson(jsonObject.todos[todoIndex]));
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
