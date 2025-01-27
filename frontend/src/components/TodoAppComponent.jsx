import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import NavbarComponent from "./NavBarComponent";
import TodoInputModalComponent from "./TodoInputModalComponent";
import TodosComponent from "./TodosComponents";

export default function TodoAppComponent() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [todos, setTodos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingTodoData, setExistingTodoData] = useState();

  async function handleDeleteTodo(todoId) {
    try {
      const response = await axios.delete(
        `http://localhost:8080/delete-todo/${todoId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      toast({
        title: "Success",
        description: response.data.message,
      });

      const updatedTodosResponse = await axios.get(
        "http://localhost:8080/get-todos",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setTodos(updatedTodosResponse.data.todos);
    } catch (err) {
      toast({
        title: "Failed",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  }

  function handleEditTodo(todoToEdit) {
    setIsEditing(true);
    setExistingTodoData(todoToEdit);
    setIsOpen(true);
  }

  async function handleSubmitTodo(data) {
    try {
      if (isEditing) {
        const response = await axios.put(
          `http://localhost:8080/update-todo/${existingTodoData._id}`,
          data,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        toast({
          title: "Success",
          description: response.data.message,
        });

        const updatedTodosResponse = await axios.get(
          "http://localhost:8080/get-todos",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setTodos(updatedTodosResponse.data.todos);
        setIsEditing(false);
        setExistingTodoData(null);
        setIsOpen(false);
      } else {
        const response = await axios.post(
          "http://localhost:8080/create-todo",
          data,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        toast({
          title: "Success",
          description: response.data.message,
        });

        const updatedTodosResponse = await axios.get(
          "http://localhost:8080/get-todos",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setTodos(updatedTodosResponse.data.todos);
        setIsOpen(false);
        setExistingTodoData(null);
      }
    } catch (err) {
      toast({
        title: "Failed",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in");
    }

    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:8080/get-todos", {
          headers: {
            Authorization: token,
          },
        });
        setTodos(response.data.todos);
      } catch (err) {
        toast({
          title: "Failed",
          description: err.response.data.message,
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <NavbarComponent setIsOpen={setIsOpen} />
      <TodosComponent
        todos={todos}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
      />
      <TodoInputModalComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        existingTodoData={existingTodoData}
        setExistingTodoData={setExistingTodoData}
        handleSubmitTodo={handleSubmitTodo}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
