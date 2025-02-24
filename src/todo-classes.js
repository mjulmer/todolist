export { TodoItem, TodoList };

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
  todos = {};
  itemIdCount = 0;

  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  addItem(name, description) {
    const newId = this.itemIdCount++;
    this.todos[newId] = new TodoItem(newId, name, description);
  }

  removeItem(id) {
    delete this.todos[id];
  }

  removeCompletedItems() {
    for (const todo in this.todos) {
      if (this.todos[todo].completed) {
        delete this.todos[todo];
      }
    }
  }
}
