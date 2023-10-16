import { useState, useEffect } from "react";
import {
  RiBringForward,
  RiBringToFront,
  RiSendToBack,
  RiSendBackward,
  RiDeleteBin5Line,
} from "react-icons/ri";

import { RgbaStringColorPicker } from "react-colorful";
import { IObjectOptions } from "fabric/fabric-impl";

type Params = {
  selected: fabric.ActiveSelection | null;
};

function ElementProps({ selected }: Params) {
  const [displayCP, setDisplayCP] = useState(false);
  const [fillColor, setFillColor] = useState<IObjectOptions["fill"]>("");

  useEffect(() => {
    if (selected) {
      //console.log(selected);
      inVals();
    }
  }, [selected]);

  useEffect(() => {
    if (fillColor) {
      selected?.set("fill", fillColor);
      selected?.canvas?.requestRenderAll();
    }
  }, [fillColor]);

  const inVals = () => {
    const fill = selected?.get("fill");
    setFillColor(fill);
  };

  return (
    <>
      <div className="el-props  flex gap-2 flex-col">
        <div>
          <div className="divider h-1 text-xs text-slate-500 !gap-1">
            Arrange
          </div>
          <div className="grid grid-cols-2 gap-1 ">
            <button
              className="btn btn-sm"
              onClick={() => {
                selected.bringToFront();
              }}
            >
              <RiBringToFront />
            </button>
            <button
              className="btn btn-sm"
              onClick={() => {
                selected.bringForward();
              }}
            >
              <RiBringForward />
            </button>
            <button
              className="btn btn-sm"
              title="Send Backward"
              onClick={() => {
                selected.sendBackwards();
              }}
            >
              <RiSendBackward />
            </button>
            <button
              className="btn btn-sm"
              title="Send To Back"
              onClick={() => {
                selected.sendToBack();
              }}
            >
              <RiSendToBack />
            </button>
          </div>
        </div>
        <div
          className=""
          onClick={() => {
            setDisplayCP(!displayCP);
          }}
        >
          <div
            className="border border-slate-700 w-1/2 h-8 rounded-lg"
            style={{ background: fillColor }}
          ></div>
        </div>

        <button className="btn btn-sm" onClick={() => {}}>
          <RiDeleteBin5Line />
        </button>

        {displayCP && selected && (
          <div className="absolute left-20">
            <RgbaStringColorPicker color={fillColor} onChange={setFillColor} />
          </div>
        )}
      </div>
    </>
  );
}

export default ElementProps;
