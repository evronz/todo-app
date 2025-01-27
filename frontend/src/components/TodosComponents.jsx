import TodoCardComponent from "./TodoCardComponent";
import { Button } from "./ui/button";

export default function Todos({ todos, handleDeleteTodo, handleEditTodo }) {
  return todos.length > 0 ? (
    todos.map((todo) => {
      return (
        <div key={todo._id} className="px-10 my-8">
          <TodoCardComponent
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            handleEditTodo={handleEditTodo}
          />
        </div>
      );
    })
  ) : (
    <div className="center px-10 mt-8">
      All the todos will be displayed here. To add a new todo click the{" "}
      <Button className="rounded-xl">Add todo</Button> button above.
    </div>
  );
}
