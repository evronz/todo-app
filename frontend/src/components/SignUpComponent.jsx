import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import axios from "axios";

export default function SignUpComponent() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/todos");
      toast({
        title: "Authorized",
        description: "You are already signed in.",
      });
    }
  }, []);

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        "http://localhost:8080/sign-up",
        values
      );

      localStorage.setItem("token", `Bearer ${response.data.token}`);

      toast({
        title: "Success",
        description: response.data.message,
      });

      navigate("/todos");
    } catch (err) {
      toast({
        title: "Failed",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  }
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-96 border-2 border-slate rounded-xl py-10 px-8">
        <div className="text-4xl text-center mb-5 font-sans font-semibold">
          Sign Up
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johnDoe@12"
                      {...field}
                      type="password"
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
              Submit
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4 ">
          Already have a account?{" "}
          <Link className="underline text-blue-500" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
