export { TodoItem, TodoList };

class TodoItem {
  id;
  name;
  description;

  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

class TodoList {
  todos = [];
  idCount = 0;

  addItem(name, description) {
    this.todos.push(new TodoItem(this.idCount++, name, description));
  }

  removeItem(id) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == id) {
        this.todos.splice(i, 1);
      }
    }
  }
}

// individual todo items
// - recurring or not
// - should carry over days or not
// - tags
// - title, description, dueDate and priority
// - streak for daily recurring items
// - unique ID (same for all instances of a recurring item)

// affordances:
//  - edit
//  - delete
//  - mark complete
//  -
