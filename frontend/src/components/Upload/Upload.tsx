import { useEffect, useState } from "react";
import UploadButton from "./UploadButton"
import Submit from "../Submit/Submit";
import PDBFetch from "../PDBFetch/PDBFetch";
import {HeaderProps, UploadButtonProps} from "../../interface/interface"

export default function Upload(props: HeaderProps) {
    const [showUploadAgain, setShowUploadAgain] = useState(true)
    const [showSubmit, setShowSubmit] = useState(false)
    const [allowSubmit, setAllowSubmit] = useState(false)
    const [showPDBFetch, setShowPDBFetch] = useState(true)

    useEffect(() => {
        setShowPDBFetch(true)
    }, [props.resetApp])

    useEffect(() => { 
        console.log(props.coordinateFile, props.reflectionFile)

        if (!props.coordinateFile && props.reflectionFile) { 
            setShowSubmit(true)
            setShowUploadAgain(true)
            setAllowSubmit(false)
            setShowPDBFetch(false)
            return
        } 

        if (!props.coordinateFile && !props.reflectionFile) { 
            setShowSubmit(false)
            setShowUploadAgain(true)
            setAllowSubmit(false)
            setShowPDBFetch(true)
            return
        }

        if (props.coordinateFile.length == 2 && props.reflectionFile) {
            setShowSubmit(true)
            setShowUploadAgain(false)
            setAllowSubmit(true)
            setShowPDBFetch(false)
        }

        if (props.coordinateFile && !props.reflectionFile) { 
            setShowSubmit(true)
            setShowUploadAgain(true)
            setAllowSubmit(true)
            setShowPDBFetch(false)
        }

        
    }, [props.coordinateFile, props.reflectionFile])

    const uploadButtonProps: UploadButtonProps = {
        coordinateFile: props.coordinateFile,
        setCoordinateFile: props.setCoordinateFile,
        setReflectionFile: props.setReflectionFile
    }

    return (
        <div className="flex flex-wrap align-middle items-center justify-center">
            { showUploadAgain === true ? <UploadButton {...uploadButtonProps}/>: <></>}
            {showSubmit === true ? 
             <Submit 
                coordinateFile={props.coordinateFile} 
                reflectionFile={props.reflectionFile} 
                submitPressed={props.setSubmit} 
                setResetApp={props.setResetApp} 
                allowSubmit={allowSubmit}
            /> : <></>}
            
            {showPDBFetch === true ? 
             <div className="mx-6 w-full lg:w-6 sm:w-full text-center">OR</div>
             :
              <></>} 
            {showPDBFetch === true ? 
             <PDBFetch PDBCode={props.PDBCode} setPDBCode={props.setPDBCode} submitPressed={props.setSubmit}/> 
            : <></>}  
            
        </div>
    )
}