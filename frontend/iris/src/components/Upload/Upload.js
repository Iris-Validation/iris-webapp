import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "flex flex-wrap align-middle items-center justify-center", children: [showUploadAgain === true ? _jsx(UploadButton, { ...uploadButtonProps }) : _jsx(_Fragment, {}), showSubmit === true ?
                _jsx(Submit, { coordinateFile: props.coordinateFile, reflectionFile: props.reflectionFile, submitPressed: props.setSubmit, setResetApp: props.setResetApp, allowSubmit: allowSubmit }) : _jsx(_Fragment, {}), showPDBFetch === true ?
                _jsx("div", { className: "mx-6 w-full lg:w-6 sm:w-full text-center", children: "OR" })
                :
                    _jsx(_Fragment, {}), showPDBFetch === true ?
                _jsx(PDBFetch, { PDBCode: props.PDBCode, setPDBCode: props.setPDBCode, submitPressed: props.setSubmit })
                :
                    _jsx(_Fragment, {})] }));
}
