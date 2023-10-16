import "./Editor.css";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useWindowSize } from "usehooks-ts";
import Sidebar from "./Sidebar";
import Elements from "./components/Elements";

import { arrow, crown } from "./components/Shapes";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const designData = atomWithStorage("jsonData", {});
const elementsData = atomWithStorage("elements", {});

function Editor() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [ratio, setRatio] = useState(1);
  const [design, setDesign] = useAtom(designData);
  const [elements, setElements] = useAtom(elementsData);
  const [zoom, setZoom] = useState(100);

  const [selected, setSelected] = useState<fabric.ActiveSelection | null>(null);
  const { width, height } = useWindowSize();

  const wrap = useRef<HTMLDivElement>(null);
  const cnv = useRef<HTMLDivElement>(null);
  const drawerToggle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const _canvas = initCanvas();
    setCanvas(_canvas);
    return () => {
      if (_canvas) _canvas.dispose();
      setCanvas(null);
    };
  }, []);

  const initCanvas = (): fabric.Canvas =>
    new fabric.Canvas(cnv.current, {
      width: 1000,
      height: 1000,
      backgroundColor: "#333336",
      preserveObjectStacking: true,
    });

  useEffect(() => {
    if (canvas) {
      initEvents();
      canvasReady();
    }
  }, [canvas]);

  useEffect(() => {
    if (design) {
      //console.log(design);
    }
  }, [design]);

  const initEvents = () => {
    if (Object.keys(design).length === 0) {
    } else {
      canvas.loadFromJSON(JSON.parse(design), (obj) => {
        canvas.renderAll();
        console.log(" this is a callback. invoked when canvas is loaded!xxx ");
      });
    }

    canvas.on("mouse:down", (options) => {
      const design = JSON.stringify(canvas.toDatalessJSON());
      setDesign(design);
    });

    const HandleElement = () => {
      const _active = canvas.getActiveObject();
      if (_active) {
        setSelected(_active);
      }
    };

    canvas.on("selection:created", HandleElement);
    canvas.on("selection:updated", HandleElement);

    canvas.on("selection:cleared", function () {
      setSelected(null);
    });

    fabric.Canvas.prototype.getCoords = function (object) {
      return {
        left: object.left + this._offset.left,
        top: object.top + this._offset.top,
      };
    };
  };

  const unSelect = () => {
    setSelected(null);
  };

  const inputRect = fabric.util.createClass(fabric.Rect, {
    type: "inputRect",
    initialize: function (options) {
      options || (options = {});
      this.callSuper("initialize", options);
      this.set("name", options.name || "");
      this.set("label", options.label || "");
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        name: this.get("name"),
        label: this.get("label"),
      });
    },

    _render: function (ctx) {
      this.callSuper("_render", ctx);

      ctx.font = "20px Helvetica";
      ctx.fillStyle = "#333";
      ctx.fillText(this.label, -this.width / 2, -this.height / 2 + 20);
    },
  });

  const createEl = (type: string, params) => {
    switch (type) {
      case "text":
        canvas?.add(
          new fabric.IText("Lorem ipsum dolor", {
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            backgroundColor: "#FFF",
            originX: "center",
            originY: "center",
          }),
        );
        break;

      case "rect":
        canvas?.add(
          new fabric.Rect({
            left: 100,
            top: 100,
            fill: "#ffa726",
            width: 100,
            height: 100,
            originX: "center",
            originY: "center",
          }),
        );
        break;

      case "circle":
        canvas?.add(
          new fabric.Circle({
            radius: 50,
            left: 100,
            top: 100,
            fill: "#ffa726",
            width: 100,
            height: 100,
            originX: "center",
            originY: "center",
          }),
        );
        break;

      case "path":
        const path = new fabric.Path(crown);
        canvas?.add(path.set({ left: 200, top: 50 }));
        break;

      case "image":
        fabric.Image.fromURL(params.url, (img) => {
          canvas.add(img);
        });
        break;
    }
  };

  const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  const canvasReady = () => {
    const img = document.createElement("img");
    img.src = deleteIcon;

    function deleteObject(eventData, transform) {
      const target = transform.target;
      const canvas = target.canvas;
      canvas.remove(target);
      canvas.requestRenderAll();
    }

    function renderIcon(
      ctx: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: any,
      fabricObject: fabric.Object,
    ) {
      const size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    fabric.Object.prototype.transparentCorners = true;
    fabric.Object.prototype.cornerStyle = "circle";
    console.log(fabric.Object.prototype);
    fabric.Object.prototype.setControlsVisibility({
      mtr: false,
    });

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24,
    });

    fabric.Image.fromURL(
      "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3087&q=80",
      function (img) {
        setRatio(img?.height / img?.width);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: 1000 / img?.width,
          scaleY: 1000 / img?.height,
        });
      },
    );
  };

  useEffect(() => {
    if (canvas && wrap.current) {
      wrap.current.style.width = zoom + "%";
      const ww = wrap.current.clientWidth;
      const scale = ww / canvas.getWidth();
      const _z = canvas.getZoom() * scale;
      const _r = ratio || canvas.getWidth() / canvas.getHeight();
      canvas.setDimensions({ width: ww, height: ww / _r });
      canvas.setViewportTransform([_z, 0, 0, _z, 0, 0]);
    }
  }, [width, height, canvas, ratio, zoom]);

  return (
    <>
      <div className="drawer md:drawer-open">
        <input
          id="main-drawer"
          type="checkbox"
          className="drawer-toggle"
          ref={drawerToggle}
        />

        <div className="drawer-content overflow-x-auto h-full relative">
          <header className="bg-gray-900 flex justify-between w-full h-8">
            <div className="">
              <div className="flex-none md:hidden">
                <label
                  htmlFor="main-drawer"
                  aria-label="open sidebar"
                  className="btn btn-sm btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>

            <div className="flex w-64 items-center gap-2">
              <input
                type="range"
                min="25"
                max="150"
                value={zoom}
                step="25"
                onChange={(el) => {
                  //console.log(el.target.value);
                  setZoom(el.target.value);
                }}
                className="range range-xs"
              />
              <span className="text-xs w-10">{zoom}</span>
            </div>
          </header>

          <main className="overflow-y-auto">
            <div className="wrap relative" ref={wrap}>
              <canvas ref={cnv} />
              <Elements elements={elements} />
            </div>
          </main>

          <footer className="p-4 bg-black/50 flex justify-between absolute bottom-0 w-full h-8">
            <div className="flex items-center text-sm">-</div>
            <div className="flex w-64 items-center gap-2">-</div>
          </footer>
        </div>

        <div className="drawer-side sidebar md:sticky overflow-visible h-full">
          <label
            aria-label="close sidebar"
            className="drawer-overlay !bg-transparent"
            onClick={unSelect}
          ></label>

          <Sidebar createEl={createEl} selected={selected} />
        </div>
      </div>
    </>
  );
}

export default Editor;
