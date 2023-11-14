interface RingKnurlingType { 
    header: string
    radius: number
    number: number
    center: Array<number>
}

import { Dispatch, SetStateAction } from "react";


export interface TableDataEntry { 
    svg: string, 
    wurcs: string, 
    chain: string, 
    glyconnect_id: string, 
    glytoucan_id: string,
    id: string, 
    torsion_err: number, 
    conformation_err: number, 
    anomer_err: number, 
    puckering_err: number, 
    chirality_err: number, 
    torsions: Array<TorsionEntry>
}

export interface HeaderProps { 
    resetApp: boolean,
    setResetApp: Dispatch<SetStateAction<boolean>>,
    PDBCode: string,
    setPDBCode: Dispatch<SetStateAction<string>>,
    // coordinateFile: File | null,
    // setCoordinateFile: Dispatch<SetStateAction<File | null>>,
    // reflectionFile: File | null,
    // setReflectionFile: Dispatch<SetStateAction<File | null>>,
    submit: boolean,
    setSubmit: Dispatch<SetStateAction<boolean>>,
    loadingText: string,
    fileContent: string | ArrayBuffer,
    fallback: boolean,
    mtzData: Uint8Array | null,
    failureText: string
    results: any
}

export interface SNFGProps extends HeaderProps { 
    filename: string
}

export interface UploadButtonProps { 
    setCoordinateFile: Dispatch<SetStateAction<File | null>>,
    setReflectionFile: Dispatch<SetStateAction<File | null>>
}

export interface GlycanDetailProps { 
    tableData: Array<TableDataEntry>, 
    hideMoorhen: boolean, 
    setHideMoorhen: Dispatch<SetStateAction<boolean>>,
    rowID: number, 
    forwardControls: any, 
    scrollPosition: number, 
    controls: any, 
    molecule: any, 
    map: any
}

export interface NoGlycansProps { 
    setResetApp: Dispatch<SetStateAction<boolean>>, 
    text: string
}

export interface SVGTableProps { 
    tableData: Array<TableDataEntry>, 
    allowRowClick: boolean, 
    rowClick: boolean,
    setRowClicked: Dispatch<SetStateAction<boolean>>, 
    setRowID: Dispatch<SetStateAction<number>>
}

