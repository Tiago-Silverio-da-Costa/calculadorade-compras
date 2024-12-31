"use client"

import { useState, ChangeEvent } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

type Item = {
  name: string;
  price: string;
  isEditable: boolean;
};

export default function Home() {

  const [items, setItems] = useState<Item[]>(() => {
    const storedItems = sessionStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : []
  })
  const [currentItem, setCUrrentItem] = useState({
    name: "",
    price: "",
    isEditable: false,
  })

  const saveToSessionStorage = (newItems: Item[]) => {
    sessionStorage.setItem("items", JSON.stringify(newItems))
  };

  const handleAddItem = () => {
    const newItems = [...items, { ...currentItem, isEditable: false }];
    setItems(newItems);
    saveToSessionStorage(newItems);
    setCUrrentItem({
      name: "",
      price: "",
      isEditable: false,
    })
  }

  const handleSaveItem = (index:number,  updatedItem: Item) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...updatedItem, isEditable: false } : item
    );
    setItems(updatedItems);
    saveToSessionStorage(updatedItems);
  };

  const handleEditItem = (index: number) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, isEditable: false } : item
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
      .toFixed(2)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Item
  ) => {
    setCUrrentItem({ ...currentItem, [field]: e.target.value })
  }

  return (
    <div className="flex flex-col py-8 m-auto w-5/6 max-w-2xl">
      <div className="flex flex-wrap justify-center w-full rounded-t-2xl py-8 gap-2 bg-purple-700 text-white">
        <div className="flex">
          <div className="flex items-center px-6 gap-2">
            <div className="flex text-black items-center md:flex-row flex-col w-full gap-2">
              <input
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Insira o item"
                value={currentItem.name}
                onChange={(e) => handleInputChange(e, "name")}
              />
              <input
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Insira o preço do item"
                value={currentItem.price}
                onChange={(e) => handleInputChange(e, "price")}
              />
            </div>
            <button
              className="text-white bg-green-500 p-2 rounded-lg"
              onClick={handleAddItem}
            >
              <FaCheck />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-white py-4 px-6 rounded-b-2xl">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-300"
          >
            <input
              className="w-1/2 px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
              value={item.name}
              disabled={!item.isEditable}
              onChange={(e) =>
                handleSaveItem(index, { ...item, name: e.target.value })
              }
            />
            <input
              className="w-1/4 px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
              value={item.price}
              disabled={!item.isEditable}
              onChange={(e) =>
                handleSaveItem(index, { ...item, price: e.target.value })
              }
            />
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
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end py-4 text-lg font-semibold">
        <p>Total: R$ {calculateTotal()}</p>
      </div>
    </div>
  );
}
