import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpComponent from "./components/SignUpComponent";
import SignInComponent from "./components/SignInComponent";
import TodoAppComponent from "./components/TodoAppComponent";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-up" element={<SignUpComponent />} />
          <Route path="/sign-in" element={<SignInComponent />} />
          <Route path="/todos" element={<TodoAppComponent />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}
