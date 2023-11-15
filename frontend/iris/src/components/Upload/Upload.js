import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
const _jsxFileName = "/Users/dialpuri/Development/iris-webapp/frontend/iris/src/components/Upload/Upload.tsx";
import { useEffect, useState } from "react";
import UploadButton from "./UploadButton";
import Submit from "../Submit/Submit";
import PDBFetch from "../PDBFetch/PDBFetch";
export default function Upload(props) {
    const [showUploadAgain, setShowUploadAgain] = useState(true);
    const [showSubmit, setShowSubmit] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [showPDBFetch, setShowPDBFetch] = useState(true);
    useEffect(() => {
        setShowPDBFetch(true);
    }, [props.resetApp]);
    useEffect(() => {
        if (props.coordinateFile && props.reflectionFile) {
            setShowSubmit(true);
            setShowUploadAgain(false);
            setAllowSubmit(true);
            setShowPDBFetch(false);
        }
        if (props.coordinateFile && !props.reflectionFile) {
            setShowSubmit(true);
            setShowUploadAgain(true);
            setAllowSubmit(true);
            setShowPDBFetch(false);
        }
        if (!props.coordinateFile && props.reflectionFile) {
            setShowSubmit(true);
            setShowUploadAgain(true);
            setAllowSubmit(false);
            setShowPDBFetch(false);
        }
        if (!props.coordinateFile && !props.reflectionFile) {
            setShowSubmit(false);
            setShowUploadAgain(true);
            setAllowSubmit(false);
            setShowPDBFetch(true);
        }
    }, [props.coordinateFile, props.reflectionFile]);
    const uploadButtonProps = {
        setCoordinateFile: props.setCoordinateFile,
        setReflectionFile: props.setReflectionFile
    };
    return (_jsxDEV("div", { className: "flex flex-wrap align-middle items-center justify-center", children: [showUploadAgain === true ? _jsxDEV(UploadButton, { ...uploadButtonProps }, void 0, false, { fileName: _jsxFileName, lineNumber: 54, columnNumber: 41 }, this) : _jsxDEV(_Fragment, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 54, columnNumber: 81 }, this), showSubmit === true ?
                _jsxDEV(Submit, { coordinateFile: props.coordinateFile, reflectionFile: props.reflectionFile, submitPressed: props.setSubmit, setResetApp: props.setResetApp, allowSubmit: allowSubmit }, void 0, false, { fileName: _jsxFileName, lineNumber: 55, columnNumber: 35 }, this) : _jsxDEV(_Fragment, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 62, columnNumber: 17 }, this), showPDBFetch === true ?
                _jsxDEV("div", { className: "mx-6 w-full lg:w-6 sm:w-full text-center", children: "OR" }, void 0, false, { fileName: _jsxFileName, lineNumber: 64, columnNumber: 37 }, this)
                :
                    _jsxDEV(_Fragment, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 66, columnNumber: 15 }, this), showPDBFetch === true ?
                _jsxDEV(PDBFetch, { PDBCode: props.PDBCode, setPDBCode: props.setPDBCode, submitPressed: props.setSubmit }, void 0, false, { fileName: _jsxFileName, lineNumber: 68, columnNumber: 37 }, this)
                : _jsxDEV(_Fragment, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 70, columnNumber: 14 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 52, columnNumber: 13 }, this));
}
