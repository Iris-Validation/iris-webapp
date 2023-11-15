import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "/Users/dialpuri/Development/iris-webapp/frontend/iris/src/components/Upload/UploadButton.tsx";
import { useState } from "react";
export default function UploadButton(props) {
    const fileUpload = (e) => {
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                let splitname = e.target.files[i].name.split(".");
                let ext = splitname[splitname.length - 1];
                if (ext == "pdb" || ext == "cif" || ext == "mmcif") {
                    props.setCoordinateFile(e.target.files[i]);
                }
                else if (ext == "mtz") {
                    props.setReflectionFile(e.target.files[i]);
                }
                else {
                    console.error("Unknown File Type.");
                }
            }
        }
    };
    const [dragActivate, setDragActive] = useState(false);
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files[0]) {
            props.setCoordinateFile(e.dataTransfer.files[0]);
        }
        setDragActive(false);
    };
    return (_jsxDEV("div", { className: "flex items-center justify-center m-12 w-64 hover:border-slate-500 hover:bg-white", children: !dragActivate ? _jsxDEV("label", { className: "flex flex-col items-center justify-center w-full p-12 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-hover border-gray-600", children: [_jsxDEV("div", { className: "flex flex-col items-center justify-center pt-5 pb-6 text-center", onDragOver: handleDragOver, onDrop: handleDrop, onDragEnter: () => { console.log("DRAG ENTER"); }, onDragExit: (e) => { console.log("LEAVE", e); }, children: [_jsxDEV("svg", { className: "w-8 h-8 mb-4 text-gray-500 dark:text-gray-400", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 20 16", children: _jsxDEV("path", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" }, void 0, false, { fileName: _jsxFileName, lineNumber: 49, columnNumber: 25 }, this) }, void 0, false, { fileName: _jsxFileName, lineNumber: 47, columnNumber: 21 }, this), _jsxDEV("p", { className: "mb-2 text-md text-gray-500 dark:text-gray-400", children: _jsxDEV("span", { className: "font-semibold", children: "Choose a file" }, void 0, false, { fileName: _jsxFileName, lineNumber: 52, columnNumber: 82 }, this) }, void 0, false, { fileName: _jsxFileName, lineNumber: 52, columnNumber: 21 }, this), _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["PDB, mmCIF or MTZ.", _jsxDEV("br", {}, void 0, false, { fileName: _jsxFileName, lineNumber: 54, columnNumber: 95 }, this), "Files will never be sent externally."] }, void 0, true, { fileName: _jsxFileName, lineNumber: 54, columnNumber: 21 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 46, columnNumber: 17 }, this), _jsxDEV("input", { id: "dropzone-file", type: "file", className: "hidden", accept: ".pdb,.mmcif,.cif,.mtz", onChange: fileUpload }, void 0, false, { fileName: _jsxFileName, lineNumber: 57, columnNumber: 17 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 45, columnNumber: 29 }, this)
            : _jsxDEV("label", { className: "flex flex-col items-center justify-center w-full p-12 h-64 border-2 border-gray-300  rounded-lg cursor-pointer hover:bg-hover border-gray-600", children: _jsxDEV("div", { className: "flex flex-col items-center justify-center pt-5 pb-6 text-center", onDragOver: handleDragOver, onDrop: handleDrop, onDragEnter: () => { console.log("DRAG ENTER"); }, onDragExit: (e) => { console.log("LEAVE", e); }, children: [_jsxDEV("svg", { className: "w-8 h-8 mb-4 text-gray-500 dark:text-gray-400", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 20 16", children: _jsxDEV("path", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" }, void 0, false, { fileName: _jsxFileName, lineNumber: 64, columnNumber: 29 }, this) }, void 0, false, { fileName: _jsxFileName, lineNumber: 62, columnNumber: 25 }, this), _jsxDEV("p", { className: "mb-2 text-md text-gray-500 dark:text-gray-400", children: _jsxDEV("span", { className: "font-semibold", children: "Drop here!" }, void 0, false, { fileName: _jsxFileName, lineNumber: 67, columnNumber: 86 }, this) }, void 0, false, { fileName: _jsxFileName, lineNumber: 67, columnNumber: 25 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 61, columnNumber: 21 }, this) }, void 0, false, { fileName: _jsxFileName, lineNumber: 60, columnNumber: 18 }, this) }, void 0, false, { fileName: _jsxFileName, lineNumber: 43, columnNumber: 13 }, this));
}
