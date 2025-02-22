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

  removeCompletedItems() {
    this.todos = this.todos.filter((it) => !it.completed);
  }
}
