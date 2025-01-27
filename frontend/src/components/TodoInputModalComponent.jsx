import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export default function TodoInputModalComponent({
  isOpen,
  setIsOpen,
  existingTodoData = null,
  setExistingTodoData,
  handleSubmitTodo,
  isEditing,
  setIsEditing,
}) {
  const form = useForm();
  useEffect(() => {
    if (existingTodoData) {
      for (let key in existingTodoData) {
        form.setValue(key, existingTodoData[key]);
      }
    } else {
      form.setValue("title", "");
      form.setValue("description", "");
    }
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setExistingTodoData(null);
          setIsOpen(false);
          setIsEditing(false);
        }}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-3xl text-center">
              {isEditing ? "Edit Todo" : "Add Todo"}
            </DialogTitle>
          </DialogHeader>
          <div className="w-96">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmitTodo)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title"
                          {...field}
                          // {...form.register("title")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Description"
                          {...field}
                          // {...form.register("description")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full rounded-xl"
                >
                  {isEditing ? "Update Todo" : "Add Todo"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
