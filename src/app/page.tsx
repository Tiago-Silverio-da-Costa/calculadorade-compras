"use client"

import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

type Item = {
  name: string;
  price: string;
  isEditable: boolean;
};

const schema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "O preço deve ser um número válido",
  }),
});
type FormValues = z.infer<typeof schema>;

export default function Home() {

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const storedItems = sessionStorage.getItem("items");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", price: "" },
  });


  const saveToSessionStorage = (newItems: Item[]) => {
    sessionStorage.setItem("items", JSON.stringify(newItems));
  };


  const onSubmit = (data: FormValues) => {
    const newItem = { ...data, isEditable: false };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleSaveItem = (index: number, updatedItem: Item) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...updatedItem, isEditable: false } : item
    );
    setItems(updatedItems);
    saveToSessionStorage(updatedItems);
  };

  const handleEditItem = (index: number) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, isEditable: true } : item
    );
    setItems(updatedItems);
    saveToSessionStorage(updatedItems);
  }

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
    saveToSessionStorage(updatedItems)
  }

  const calculateTotal = (): string =>
    items
      .reduce((sum, item) => sum + parseFloat(item.price || "0"), 0)
      .toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex flex-col py-8 m-auto w-5/6 max-w-2xl">
      <div className="flex flex-wrap justify-center bg-slate-100 w-full rounded-t-2xl py-8 gap-2  text-white">
        <div className="flex w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex items-start px-6 gap-2">
            <div className="flex text-black items-start md:flex-row flex-col w-full gap-2">
              <div className="flex flex-col gap-2 items-start w-full">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Insira o item"
                      inputMode="text"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-start w-full">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Insira o preço do item"
                      inputMode="decimal"
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-green-500 p-2 rounded-lg"
            >
              <FaCheck />
            </button>
          </form>
        </div>
      </div>
      <div className={`flex flex-col gap-2 bg-slate-400 ${items.length === 0 ? "" : "py-8 px-6"}`}>
        {(items || []).map((item, index) => (
          <div
            key={index}
            className="flex gap-2 items-center"
          >
            <div className="flex flex-col gap-2 items-start w-full">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    disabled={!item.isEditable}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Insira o item"
                    inputMode="text"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-start w-full">
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    disabled={!item.isEditable}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Insira o preço do item"
                    inputMode="decimal"
                  />
                )}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
            {item.isEditable ? (
              <button
                className="text-white bg-green-500 p-2 rounded-lg"
                onClick={() =>
                  handleSaveItem(index, { ...item, isEditable: false })
                }
              >
                <FaCheck />
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <button
                    className="text-white bg-slate-600 p-2 rounded-lg"
                    onClick={() => handleEditItem(index)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="text-white bg-red-600 p-2 rounded-lg"
                    onClick={() => handleDeleteItem(index)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end text-lg font-semibold bg-slate-600 py-4 px-6 rounded-b-2xl">
        <p>Total: {calculateTotal()}</p>
      </div>
    </div>
  );
}
