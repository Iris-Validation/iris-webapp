import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
const _jsxFileName = "/Users/dialpuri/Development/iris-webapp/frontend/iris/src/pages/Home.tsx";
import { lazy, useEffect, useState } from "react";
import { Header } from '../layouts/Header';
import { Information } from '../components/Information/Information';
// @ts-ignore
import iris_module from "../../api/iris.js";
const Footer = lazy(() => import('../layouts/Footer'));
const BorderElement = lazy(() => import('../layouts/BorderElement'));
import { fetch_map, fetch_pdb } from "../utils/fetch_from_pdb";
export default function HomeSection() {
    const [coordinateFile, setCoordinateFile] = useState(null);
    const [reflectionFile, setReflectionFile] = useState(null);
    const [PDBCode, setPDBCode] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [mtzData, setMtzData] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [loadingText, setLoadingText] = useState("Validating Glycans...");
    const [resetApp, setResetApp] = useState(false);
    const [fallback, setFallBack] = useState(false);
    const [failureText, setFailureText] = useState("");
    const [results, setResults] = useState(null);
    async function run_iris(Module, response) {
        Module['FS_createDataFile']('/', "input.mtz", mtzData, true, true, true);
        Module['FS_createDataFile']('/', "input.pdb", response, true, true, true);
        let x = Module.test();
        console.log(x);
        setResults(x);
        setFailureText("");
    }
    useEffect(() => {
        if (PDBCode != "") {
            console.log(PDBCode);
            setLoadingText(`Fetching ${PDBCode.toUpperCase()} from the PDB`);
            fetch_map(PDBCode).then((response) => {
                let array = new Uint8Array(response);
                setMtzData(array);
            }).catch(() => {
                setLoadingText("MTZ not found, continuing...");
            });
            fetch_pdb(PDBCode).then((response) => {
                let array = new Uint8Array(response);
                setFileContent(array);
                setLoadingText("Generating Iris Report...");
                iris_module().then((Module) => run_iris(Module, response));
            }).catch((e) => {
                console.log(e);
            });
        }
        else {
            iris_module().then((Module) => {
                var coordinateReader = new FileReader();
                var reflectionReader = new FileReader();
                coordinateReader.onload = () => {
                    Module['FS_createDataFile']('/', "input.pdb", coordinateReader.result, true, true, true);
                    let x = Module.test();
                    setResults(x);
                };
                if (coordinateFile) {
                    coordinateReader.readAsText(coordinateFile);
                }
                reflectionReader.onload = async () => {
                    let reader = reflectionReader.result;
                    // @ts-ignore
                    let map_data = new Uint8Array(reader);
                    setMtzData(map_data);
                    Module['FS_createDataFile']('/', "input.mtz", map_data, true, true, true);
                };
                if (reflectionFile) {
                    reflectionReader.readAsArrayBuffer(reflectionFile);
                }
            });
        }
    }, [submit]);
    useEffect(() => {
        setReflectionFile(null);
        setCoordinateFile(null);
        setSubmit(false);
        setFallBack(false);
        setResetApp(false);
        setPDBCode("");
        setResults(null);
    }, [resetApp]);
    const main_props = {
        resetApp: resetApp,
        setResetApp: setResetApp,
        PDBCode: PDBCode,
        setPDBCode: setPDBCode,
        coordinateFile: coordinateFile,
        setCoordinateFile: setCoordinateFile,
        reflectionFile: reflectionFile,
        setReflectionFile: setReflectionFile,
        submit: submit,
        setSubmit: setSubmit,
        loadingText: loadingText,
        fileContent: fileContent,
        fallback: fallback,
        mtzData: mtzData,
        failureText: failureText,
        results: results
    };
    return (_jsxDEV(_Fragment, { children: [_jsxDEV(Header, { ...main_props }, void 0, false, { fileName: _jsxFileName, lineNumber: 130, columnNumber: 13 }, this), _jsxDEV(BorderElement, { topColor: "#e0e1dd", bottomColor: "#F4F9FF", reverse: false }, void 0, false, { fileName: _jsxFileName, lineNumber: 131, columnNumber: 13 }, this), _jsxDEV(Information, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 132, columnNumber: 13 }, this), _jsxDEV(BorderElement, { topColor: "#F4F9FF", bottomColor: "#e0e1dd", reverse: true }, void 0, false, { fileName: _jsxFileName, lineNumber: 133, columnNumber: 13 }, this), _jsxDEV(Footer, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 134, columnNumber: 13 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 128, columnNumber: 13 }, this));
}
