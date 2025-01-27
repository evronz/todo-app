import { Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TodoCardComponent({
  todo,
  handleEditTodo,
  handleDeleteTodo,
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{todo.title}</CardTitle>
          {/* <CardDescription>{todo.description}</CardDescription */}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              handleEditTodo(todo);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteTodo(todo._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>{todo.description}</CardContent>
    </Card>
  );
}
