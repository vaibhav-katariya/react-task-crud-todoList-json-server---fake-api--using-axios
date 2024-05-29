import axios from "axios";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [view, setView] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/todos");
        setTodo(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const todoPostHandler = async (event) => {
    event.preventDefault();
    if (newTodo.trim() === "") return; // Do not allow empty todos

    try {
      const response = await axios.post("http://localhost:8000/todos", {
        id: uuidv4(),
        title: newTodo,
      });
      setTodo([...todo, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log(error);
    }
  };

  const todoDeleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/todos/${id}`);
      setTodo(todo.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const viewTodo = (val, id) => {
    setView(val);
    setId(id);
    setIsEdit(true);
  };

  const todoEditHandler = async () => {
    if (view.trim() === "") return; 

    try {
      await axios.put(`http://localhost:8000/todos/${id}`, {
        title: view,
      });
      setTodo(
        todo.map((item) =>
          item.id === id ? { ...item, title: view } : item
        )
      );
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full bg-zinc-900 overflow-hidden">
      <div className="flex justify-center gap-5 py-5 w-full">
        <form onSubmit={todoPostHandler} className="flex gap-5">
          <input
            className="py-2 px-3 rounded-xl bg-zinc-800 outline-none text-zinc-300"
            type="text"
            name="todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            id="todo"
            placeholder="Enter Your Todo"
          />
          <button
            type="submit"
            className="px-3 bg-blue-500 rounded-xl text-white"
          >
            ADD
          </button>
        </form>
      </div>
      <div className="h-[80%] w-full flex justify-center overflow-y-scroll no-scrollbar">
        <ul className="p-5 w-[60%]">
          {todo.map((item) => (
            <li
              key={item.id}
              className="py-2 border-[1px] border-zinc-700 px-2 my-2 rounded-xl w-full text-white flex justify-between items-center"
            >
              <p>{item.title}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => viewTodo(item.title, item.id)}
                  className="h-full bg-zinc-800 px-3 py-2 rounded-xl font-semibold"
                >
                  EDIT
                </button>
                <button
                  onClick={() => todoDeleteHandler(item.id)}
                  className="h-full bg-red-500 px-3 py-2 rounded-xl font-semibold"
                >
                  DELETE
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {isEdit && (
        <div className="h-screen absolute top-0 flex justify-center items-center w-full bg-zinc-700 bg-opacity-40">
          <div className="bg-zinc-900 border-[1px] p-5 text-white border-zinc-700">
            <h1 className="font-semibold m-2">EDIT TODO</h1>
            <div className="flex gap-5 flex-col">
              <input
                className="py-2 px-3 rounded-xl bg-zinc-800 outline-none text-zinc-300"
                name="todo"
                id="todo"
                value={view}
                onChange={(e) => setView(e.target.value)}
                placeholder="Enter Your Todo"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEdit(false)}
                  className="bg-zinc-800 text-sm px-3 py-2 rounded-xl font-semibold"
                >
                  CANCEL
                </button>
                <button
                  onClick={todoEditHandler}
                  type="button"
                  className="bg-blue-400 text-sm px-3 py-2 rounded-xl font-semibold"
                >
                  EDIT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
