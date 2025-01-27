import { Button } from "./ui/button";

export default function NavbarComponent({ setIsOpen }) {
  return (
    <div className="h-50 w-full">
      <div className="h-50 w-full flex justify-between px-20 py-8 shadow-md">
        <div className="text-5xl">Todos</div>
        <div>
          <Button
            className="rounded-xl"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Add Todo
          </Button>
        </div>
      </div>
    </div>
  );
}
