import { lazy, useEffect, useState } from "react";

import { Header } from '../layouts/Header';
import { Information } from '../components/Information/Information';

//@ts-ignore
import iris_module from "../api/iris-api.js";
// const iris_module = lazy(() => import("../api/iris"))

const Footer = lazy(() => import('../layouts/Footer'));
const BorderElement = lazy(() => import('../layouts/BorderElement'));

import { HeaderProps } from "../interface/interface"
import { fetch_map, fetch_pdb } from "../utils/fetch_from_pdb";

export default function HomeSection() {
    const [coordinateFile, setCoordinateFile] = useState<File[] | null>(null);
    const [reflectionFile, setReflectionFile] = useState<File | null>(null);
    const [PDBCode, setPDBCode] = useState<string>("")
    const [fileContent, setFileContent] = useState<string | ArrayBuffer>("")
    // const [mtzData, setMtzData] = useState<Uint8Array | null>(null)
    // const [mapData, setMapData] = useState<Uint8Array | null>(null)
    const [submit, setSubmit] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("Validating Glycans...");
    const [resetApp, setResetApp] = useState<boolean>(false)
    const [fallback, setFallBack] = useState<boolean>(false)
    const [failureText, setFailureText] = useState<string>("")
    const [results, setResults] = useState<any>(null)
    const [fileNames, setFileNames] = useState<Array<string>>();

    async function run_iris(Module: any) {
        let backend_call = Module.calculate(false);

        setResults(backend_call.results);
        setFailureText("")
    }

    useEffect(() => {
        async function load_data() {
            if (PDBCode != "") {
                console.log(PDBCode)
                setLoadingText(`Fetching ${PDBCode.toUpperCase()} from the PDB`)

                let map_response = await fetch_map(PDBCode)
                let pdb_response = await fetch_pdb(PDBCode)
                let map_data = new Uint8Array(map_response)
                let pdb_data = new Uint8Array(pdb_response as unknown as ArrayBuffer)

                setFileContent(pdb_data)
                setLoadingText("Generating Iris Report...")

                iris_module().then((Module: any) => {
                    Module['FS_createDataFile']('/', "input.map", map_data, true, true, true)
                    Module['FS_createDataFile']('/', "input1.pdb", pdb_response, true, true, true)

                    run_iris(Module)
                })
            }
            else {
                iris_module().then(async (Module: any) => {
                    const reflection_promise = (Module: any) => {
                        return new Promise((resolve, reject) => { 
                            const reader = new FileReader(); 
                            const file_name = `input.mtz`

                            reader.onload = () => {
                                console.log("Writing", file_name)
                                // @ts-ignore
                                let map_data = new Uint8Array(reader.result);
                                Module['FS_createDataFile']('/', file_name, map_data, true, true, true)

                                // setMtzData(map_data)

                                resolve(file_name)
                            }

                            reader.onerror = (error) => { 
                                reject(error)
                            }

                            if (reflectionFile) {
                                reader.readAsArrayBuffer(reflectionFile)
                            }
                            else {
                                resolve("no file supplied")
                            }
                        })
                    }

                    if (!coordinateFile) return

                    let file_names = coordinateFile.map((item) => {return item.name})
                    setFileNames(file_names)
                    
                    const reader_promises = coordinateFile.map((item, index) => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();

                            const file_name = `input${index + 1}.pdb`
                            reader.onload = () => {
                                console.log("Writing", file_name)
                                Module['FS_createDataFile']('/', file_name, reader.result, true, true, true)
                                resolve(file_name)
                            }

                            reader.onerror = (error) => { 
                                reject(error)
                            }

                            if (coordinateFile) {
                                reader.readAsText(item)
                            }
                        })
                    })

                    await Promise.all(reader_promises);
                    await reflection_promise(Module)

                    console.log("Sending for results")
                    let backend_call = Module.calculate(coordinateFile.length > 1)
                    setResults(backend_call.results)
                })
}
        }
load_data()
    }, [submit])

useEffect(() => {
    setReflectionFile(null)
    setCoordinateFile(null)
    setSubmit(false)
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
    loadingText: loadingText,
    fileContent: fileContent,
    fallback: fallback,
    // mtzData: mtzData,
    failureText: failureText,
    results: results,
    fileNames: fileNames
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