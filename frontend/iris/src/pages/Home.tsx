import { lazy, useEffect, useState } from "react";

import { Header } from '../layouts/Header';
import { Information } from '../components/Information/Information.tsx';
// @ts-ignore
import iris_module from "../../api/iris.js"

const Footer = lazy(() => import('../layouts/Footer.tsx'));
const BorderElement = lazy(() => import('../layouts/BorderElement.tsx'));
 
import {TableDataEntry, HeaderProps} from "../../interfaces/types"
import { fetch_map, fetch_pdb } from "../utils/fetch_from_pdb.ts";

export default function HomeSection() {
    const [coordinateFile, setCoordinateFile] = useState<File | null>(null);
    const [reflectionFile, setReflectionFile] = useState<File| null>(null);
    const [PDBCode, setPDBCode] = useState<string>("")
    const [fileContent, setFileContent] = useState<string | ArrayBuffer>("")
    const [mtzData, setMtzData] = useState<Uint8Array | null>(null)
    const [submit, setSubmit] = useState<boolean>(false);
    const [ringData, setRingData] = useState<Array<TableDataEntry> | null>(null);
    const [loadingText, setLoadingText] = useState<string>("Validating Glycans...");
    const [resetApp, setResetApp] = useState<boolean>(false)
    const [fallback, setFallBack] = useState<boolean>(false)
    const [failureText, setFailureText] = useState<string>("")
    const [results, setResults] = useState<any>(null)

    async function run_iris(Module: any, response: any) {
        Module['FS_createDataFile']('/', "input.mtz", mtzData, true, true, true)
        Module['FS_createDataFile']('/', "input.pdb", response, true, true, true)

        let x = Module.test()

        setResults(x);

    }


    useEffect(() => {
        if (PDBCode != "") {
            console.log(PDBCode)
            setLoadingText(`Fetching ${PDBCode.toUpperCase()} from the PDB`)

            fetch_map(PDBCode).then((response: ArrayBuffer) => {
                let array = new Uint8Array(response)
                setMtzData(array)

            }).catch((e: any) => {
                setLoadingText("MTZ not found, continuing...")
            })

            fetch_pdb(PDBCode).then((response: ArrayBuffer) => {
                console.log(response)
                let array = new Uint8Array(response)

                setFileContent(array)
                setLoadingText("Generating Iris Report...")

                iris_module().then((Module: any) => run_iris(Module, response))

            }).catch((e: any) => {
                console.log(e)
            })

        } else {
            iris_module().then((Module) => {
                var coordinateReader = new FileReader();
                var reflectionReader = new FileReader();

                coordinateReader.onload = () => { 
                    Module['FS_createDataFile']('/', "input.pdb", coordinateReader.result, true, true, true)

                    let x = Module.test()

                    setResults(x);                
                }

                if (coordinateFile) {
                    coordinateReader.readAsText(coordinateFile);

                }

                reflectionReader.onload = async () => {
                    let map_data = new Uint8Array(reflectionReader.result);
                    setMtzData(map_data)
                    Module['FS_createDataFile']('/', "input.mtz", map_data, true, true, true)
                }

                if (reflectionFile) {
                    reflectionReader.readAsArrayBuffer(reflectionFile)
                }
    
            })
            // privateer_module().then((Module: { [x: string]: (arg0: string, arg1: string, arg2: Uint8Array, arg3: boolean, arg4: boolean, arg5: boolean) => void; }) => {


            //     var coordinateReader = new FileReader();
            //     var reflectionReader = new FileReader();

            //     coordinateReader.onload = () => { run_iris(Module, coordinateReader.result, coordinateFile!.name) }

            //     if (coordinateFile) {
            //         coordinateReader.readAsText(coordinateFile);
            //     }

            //     reflectionReader.onload = async () => {
            //         let map_data = new Uint8Array(reflectionReader.result);
            //         setMtzData(map_data)

            //         Module['FS_createDataFile']('/', "input.mtz", map_data, true, true, true)
            //     }

            //     if (reflectionFile) {
            //         reflectionReader.readAsArrayBuffer(reflectionFile)
            //     }

            // }).catch((e: any) => console.log(e));
        }


    }, [submit])

    useEffect(() => {
        setReflectionFile(null)
        setCoordinateFile(null)
        setSubmit(false)
        setRingData(null)
        setFallBack(false)
        setResetApp(false)
        setPDBCode("")
        setResults(null)
    }, [resetApp])

    const main_props: HeaderProps = {
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
        tableData: ringData,
        loadingText: loadingText,
        fileContent: fileContent,
        fallback: fallback,
        mtzData: mtzData,
        failureText: failureText, 
        results: results
    }

    return (
        <>
            <Header {...main_props} />
            <BorderElement topColor={"#e0e1dd"} bottomColor={"#F4F9FF"} reverse={false}></BorderElement>
            <Information />
            <BorderElement topColor={"#F4F9FF"} bottomColor={"#e0e1dd"} reverse={true}></BorderElement>
            <Footer></Footer>
        </>
    )
}