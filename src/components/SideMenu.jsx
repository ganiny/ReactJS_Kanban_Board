import clsx from "clsx";
import iconBoard from "../assets/icon-board.svg";
import { useContext, useState } from "react";
import DialogPrimitive from "./DialogPrimitive";
import { DataContext } from "../DataContext";
import AddNewBoardForm from "./AddNewBoardForm";

/**
 * 
 * @param {Object} props
 * @param {number} props.selectedBoardIndex
 * @param {function} props.setSelectedBoardIndex 
 * @returns {JSX.Element} 
 */
  

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const {dataState, selectedBoardIndex, setSelectedBoardIndex} = useContext(DataContext);
  return (
    <aside className="side-menu -mt-px w-[300px] border-r border-lines-light bg-white">
      <p className="px-8 py-4 text-heading-s">ALL BOARDS ({dataState?.length})</p>
      <ul>
        {dataState?.map((item, index) => (
          <li key={item.id}>
            <button
              className={clsx(
                "flex w-11/12 items-center gap-4 rounded-e-full px-8 py-4 text-heading-m text-medium-grey transition data-[isactive=false]:hover:bg-main-purple/10 data-[isactive=false]:hover:text-main-purple",
                {
                  "bg-main-purple !text-white hover:bg-main-purple":
                    selectedBoardIndex === index,
                },
              )}
              data-isactive={selectedBoardIndex === index}
              onClick={() => setSelectedBoardIndex(index)} //setSelectedBoardIndex(index)
            >
              <img src={iconBoard} alt="icon board" /> {item.title}
            </button>
          </li>
        ))}
        <li className="px-8 py-4">
          <DialogPrimitive
            isOpen={open}
            setOpen={setOpen}
            title="Create New Board"
            triggerComponent={
              <button className="flex w-full items-center gap-4 text-heading-m text-main-purple">
                <img src={iconBoard} alt="" /> + Create New Board
              </button>
            }
          >
            <AddNewBoardForm toggleDialog={setOpen} />
          </DialogPrimitive>
        </li>
      </ul>
    </aside>
  );
};

export default SideMenu;
