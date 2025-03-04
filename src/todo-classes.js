export { TodoItem, TodoList };

class TodoItem {
  id;
  name;
  description;
  dueDate;
  priority;
  completed = false;

  constructor(id, name, description, dueDate, priority) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
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

  addItem(name, description, dueDate, priority) {
    const newId = this.itemIdCount++;
    this.todos[newId] = new TodoItem(
      newId,
      name,
      description,
      dueDate,
      priority
    );
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
