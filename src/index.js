class Model {
    constructor() {
      this.todos = [];
    }
    bindHandler(callbacks) {
      this.onTodoListChanged = callbacks.onTodoListChanged;
    }
    addTodo(todo) {
      this.todos = [...this.todos, todo];
      this.onTodoListChanged(this.todos);
    }
    deleteTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id);
      this.onTodoListChanged(this.todos);
    }
    toggleComplete(id) {
      const currentTodo = this.todos.filter(todo => todo.id === id)[0];
      currentTodo.complete = !currentTodo.complete;
      this.onTodoListChanged(this.todos);
    }
  }
  class View {
    constructor() {
      this.app = this.getElement("#app");
      this.form = this.createElement("form");
      this.input = this.createElement("input");
      this.input.type = "text";
      this.input.placeholder = "Add todo";
      this.input.name = "todo";
      this.submitButton = this.createElement("button");
      this.submitButton.textContent = "Submit";
      this.form.append(this.input, this.submitButton);
      this.title = this.createElement("h1");
      this.title.textContent = "Todos";
      this.todoList = this.createElement("ul", "todo-list");
      this.app.append(this.title, this.form, this.todoList);
    }
    get todoText() {
      return this.input.value;
    }
    resetInput() {
      this.input.value = "";
    }
    createElement(tag, className) {
      const element = document.createElement(tag);
      if (className) element.classList.add(className);
      return element;
    }
    getElement(selector) {
      const element = document.querySelector(selector);
      return element;
    }
    displayTodos(todos) {
      this.todoList.innerHTML = "";
      todos.forEach(todo => {
        const li = this.createElement("li");
        li.id = todo.id;
        const checkbox = this.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.complete;
        const span = this.createElement("span");
        if (todo.complete) {
          const strike = this.createElement("s");
          strike.textContent = todo.text;
          span.append(strike);
        } else {
          span.textContent = todo.text;
        }
        const deleteButton = this.createElement("button", "delete");
        deleteButton.textContent = "Delete";
        li.append(checkbox, span, deleteButton);
        this.todoList.append(li);
      });
      console.log(todos);
    }
    bindEventListeners(handlers) {
      this.form.addEventListener("submit", handlers.handleAddTodo);
      this.todoList.addEventListener("click", handlers.handleDeleteTodo);
      this.todoList.addEventListener("change", handlers.toggleComplete);
    }
  }
  class Controller {
    constructor(model, view) {
      this.model = new Model();
      this.view = new View();
      this.model.bindHandler(this);
      this.view.bindEventListeners(this);
    }
    onTodoListChanged = todos => {
      this.view.displayTodos(todos);
    };
    handleAddTodo = event => {
      event.preventDefault();
      if (this.view.todoText) {
        const todo = {
          id: this.model.todos.length,
          text: this.view.todoText,
          complete: false
        };
        this.model.addTodo(todo);
        this.view.resetInput();
      }
    };
    handleDeleteTodo = event => {
      const clicked = event.target;
      if (clicked.className === "delete") {
        this.model.deleteTodo(parseInt(clicked.parentElement.id, 10));
      }
    };
    handleToggleComplete = event => {
      const clicked = event.target;
      if (clicked.type === "checkbox") {
        this.model.toggleComplete(parseInt(clicked.parentElement.id, 10));
      }
    };
  }
  
  const App = new Controller();
  
  window.app = App;
  