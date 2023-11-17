import { lazy, useEffect, useState } from "react";

import { Header } from '../layouts/Header';
import { Information } from '../components/Information/Information';

//@ts-ignore
import iris_module from "../api/iris"
// const iris_module = lazy(() => import("../api/iris"))

const Footer = lazy(() => import('../layouts/Footer'));
const BorderElement = lazy(() => import('../layouts/BorderElement'));
 
import {HeaderProps} from "../interface/interface"
import { fetch_map, fetch_pdb } from "../utils/fetch_from_pdb";

export default function HomeSection() {
    const [coordinateFile, setCoordinateFile] = useState<File | null>(null);
    const [reflectionFile, setReflectionFile] = useState<File| null>(null);
    const [PDBCode, setPDBCode] = useState<string>("")
    const [fileContent, setFileContent] = useState<string | ArrayBuffer>("")
    const [mtzData, setMtzData] = useState<Uint8Array | null>(null)
    // const [mapData, setMapData] = useState<Uint8Array | null>(null)
    const [submit, setSubmit] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("Validating Glycans...");
    const [resetApp, setResetApp] = useState<boolean>(false)
    const [fallback, setFallBack] = useState<boolean>(false)
    const [failureText, setFailureText] = useState<string>("")
    const [results, setResults] = useState<any>(null)

    async function run_iris(Module: any) {
        let x = Module.test()

        setResults(x);
        setFailureText("")
    }   

    useEffect(() => {
        if (PDBCode != "") {
            console.log(PDBCode)
            setLoadingText(`Fetching ${PDBCode.toUpperCase()} from the PDB`)
            
            let map_data;
            fetch_map(PDBCode).then((response: any) => {
                map_data = new Uint8Array(response)

            }).catch(() => {
                setLoadingText("MTZ not found, continuing...")
            })

            fetch_pdb(PDBCode).then((response: any) => {
                let array = new Uint8Array(response)

                setFileContent(array)
                setLoadingText("Generating Iris Report...")

                iris_module().then((Module: any) => {
                    Module['FS_createDataFile']('/', "input.map", map_data, true, true, true)
                    Module['FS_createDataFile']('/', "input.pdb", response, true, true, true)

                    run_iris(Module)
                    
                })
                

            }).catch((e: any) => {
                console.log(e)
            })

        } else {
            iris_module().then((Module: any) => {
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
                    let reader = reflectionReader.result;
                    // @ts-ignore
                    let map_data = new Uint8Array(reader);
                    setMtzData(map_data)
                    Module['FS_createDataFile']('/', "input.mtz", map_data, true, true, true)
                }

                if (reflectionFile) {
                    reflectionReader.readAsArrayBuffer(reflectionFile)
                }
    
            })
        }


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