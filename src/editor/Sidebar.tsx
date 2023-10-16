import { useEffect, useState } from "react";
import ElementProps from "./ElementProps";

import "./Sidebar.css";
import {
  BiRectangle,
  BiText,
  BiSolidShapes,
  BiCircle,
  BiImage,
} from "react-icons/bi";

import { BsInputCursorText } from "react-icons/bs";

type Params = {
  createEl: (type: string, params?: {}) => void;
  selected: fabric.ActiveSelection | null;
};

function Sidebar({ createEl, selected }: Params) {
  const [elParams, setElParams] = useState({});

  useEffect(() => {
    if (selected) {
      selected.setControlsVisibility({
        mtr: false,
      });
      switch (selected.type) {
        case "path":
          selected.setControlsVisibility({
            mtr: true,
          });
          break;

        default:
          break;
      }
    } else {
      //console.log("unselected");
    }
  }, [selected]);

  const addParams = (event) => {
    const { name, value } = event.target;
    setElParams(() => {
      return {
        ...elParams,
        [name]: value,
      };
    });
  };

  const addImage = () => {
    createEl("image", elParams);
  };

  return (
    <>
      <input type="checkbox" id="img_modal" className="modal-toggle" />
      <div className="modal" id="img_modal">
        <div className="modal-box">
          <p>
            <input
              type="text"
              name="url"
              placeholder="Image URL"
              className="input input-bordered w-full max-w-xs"
              onChange={addParams}
            />
          </p>
          <div className="modal-action">
            <button
              className="btn btn-sm"
              htmlFor="img_modal"
              onClick={addImage}
            >
              Add Image
            </button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="img_modal">
          Close
        </label>
      </div>
      <div className="box-border dark:bg-gray-800 p-2 h-full border-r-2 border-black shadow-lg">
        <div className="logo h-8 text-center">LOGO</div>

        <div className="divider h-1 text-xs text-slate-500 !gap-1">Design</div>
        <ul className="grid grid-cols-2 gap-1">
          <li>
            <button className="btn btn-sm" onClick={() => createEl("rect")}>
              <BiRectangle />
            </button>
          </li>
          <li>
            <button className="btn btn-sm" onClick={() => createEl("circle")}>
              <BiCircle />
            </button>
          </li>
          <li>
            <button className="btn btn-sm" onClick={() => createEl("text")}>
              <BiText />
            </button>
          </li>
          <li>
            <button className="btn btn-sm" onClick={() => createEl("path")}>
              <BiSolidShapes />
            </button>
          </li>
          <li>
            <label htmlFor="img_modal" className="btn btn-sm">
              <BiImage />
            </label>
          </li>
        </ul>
        <div className="divider h-1 text-xs text-slate-500 !gap-1">Input</div>
        <ul className="grid grid-cols-2 gap-1">
          <li>
            <button
              className="btn btn-sm"
              onClick={() => createEl("textfield")}
            >
              <BsInputCursorText />
            </button>
          </li>
          <li>
            <button
              className="btn btn-sm"
              onClick={() => createEl("textfield")}
            >
              <BsInputCursorText />
            </button>
          </li>
        </ul>
        {selected && <ElementProps selected={selected} />}
      </div>
    </>
  );
}

function NavMenu() {
  return <nav>Menu</nav>;
}

export default Sidebar;
