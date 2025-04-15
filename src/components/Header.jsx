import { useContext, useState } from "react";
import DialogPrimitive from "./DialogPrimitive";
import DropdownPrimitive from "./DropdownPrimitive";
import iconVerticalEllipsis from "@assets/icon-vertical-ellipsis.svg";
import { DataContext } from "../DataContext";
import AddNewBoardForm from "./AddNewBoardForm";

const Header = () => {
  const { dataState,  setDataState, selectedBoardIndex } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const handleEditBoardClick = () => setOpen(true);

  const onDeleteBoard = () => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      setDataState((prev) => prev.toSpliced(selectedBoardIndex, 1));
    }
  };
  return (
    <header className="flex h-[97px] shrink-0 items-center">
      <div className="flex w-[300px] items-center gap-4 self-stretch border-b border-r border-lines-light pl-8 text-[32px] font-bold">
        Kanban Board
      </div>

      <div className="flex flex-1 items-center justify-between self-stretch border-b border-lines-light pl-6 pr-6">
        <h2 className="text-heading-xl">Platform Launch</h2>
        <DropdownPrimitive
          items={{
            edit: { label: "Edit Board", onClick: handleEditBoardClick },
            delete: {
              label: "Delete Board",
              onClick: onDeleteBoard,
            },
          }}
          triggerComponent={() => (
            <button className="flex w-8 items-center justify-center gap-2 text-[14px] font-bold text-main-purple">
              <img src={iconVerticalEllipsis} alt="icon vertical ellipsis" />
            </button>
          )}
        />
        <DialogPrimitive title="Edit Board" isOpen={open} setOpen={setOpen}>
          <AddNewBoardForm toggleDialog={setOpen}  boardId={dataState[selectedBoardIndex]?.id} columns={dataState[selectedBoardIndex]?.columns} title={dataState[selectedBoardIndex]?.title}/>
        </DialogPrimitive>
      </div>
    </header>
  );
};

export default Header;
