import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="flex flex-col py-8 m-auto w-5/6 max-w-2xl ">
        <div className="flex flex-wrap justify-center w-full rounded-t-2xl py-8 gap-2 bg-purple-700 text-white">
          <div className="flex">
            <div className="flex items-center px-6 gap-2">
              <div className="flex text-black items-center md:flex-row flex-col w-full gap-2">
                <input placeholder="insira o item" />
                <input placeholder="insira o preço do item" />
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-white bg-green-500 p-2 rounded-lg">
                  <FaCheck />
                </div>
                <div className="text-white bg-slate-600 p-2 rounded-lg">
                  <MdEdit />
                </div>
                <div className="text-white bg-red-600 p-2 rounded-lg">
                  <MdDelete />
                </div>
              </div>
            </div>
          </ div>
        </div>
        <div className="flex w-full rounded-b-2xl px-6 bg-slate-500 text-white">
          <p>Total: R$ 4,00</p>
        </div>
      </div>
    </>
  );
}
