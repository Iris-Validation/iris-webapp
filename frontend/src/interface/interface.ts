export interface RingKnurlingType { 
    header: number
    radius: number
    number: number
    center: Array<number>
}
export interface BorderElementProps { 
    topColor: string
    bottomColor: string
    reverse: boolean
}
export interface SubmitProps { 
    coordinateFile: any
    reflectionFile: any
    submitPressed: Dispatch<SetStateAction<boolean>>
    setResetApp: Dispatch<SetStateAction<boolean>>
    allowSubmit: boolean
}

export interface FileLineProps { 
    name: string
    icon: any
}

export interface PDBFetch { 
    PDBCode: string 
    setPDBCode: Dispatch<SetStateAction<string>>
    submitPressed: Dispatch<SetStateAction<boolean>>
}

interface IrisResults { 
    chain_labels: Array<number>
}
export interface IrisProps { 
    results: IrisResults
    fileNames: Array<string> | null
}

export interface Metric {
    array: Array<number>
    type: string
}

import { Dispatch, SetStateAction } from "react";


export interface HeaderProps { 
    resetApp: boolean,
    setResetApp: Dispatch<SetStateAction<boolean>>,
    PDBCode: string,
    setPDBCode: Dispatch<SetStateAction<string>>,
    coordinateFile: File[] | null,
    setCoordinateFile: Dispatch<SetStateAction<File[] | null>>,
    reflectionFile: File | null,
    setReflectionFile: Dispatch<SetStateAction<File | null>>,
    submit: boolean,
    setSubmit: Dispatch<SetStateAction<boolean>>,
    loadingText: string,
    fileContent: string | ArrayBuffer,
    fallback: boolean,
    // mtzData: Uint8Array | null,
    failureText: string
    results: any
    fileNames: Array<string> | null
}

export interface UploadButtonProps { 
    coordinateFile: File[],
    setCoordinateFile: any,
    setReflectionFile: Dispatch<SetStateAction<File | null>>
}

export interface ChainSelectionButtonsTypes { 
    chainList: Array<string>
    chainListSet: boolean
    selectedChain: string 
    setSelectedChain: Dispatch<SetStateAction<string>>
}


