import { lazy, Suspense } from 'react'

const Upload = lazy(() => import('../components/Upload/Upload.tsx'));
const Loading = lazy(() => import('../components/Loading/Loading.tsx'));
const NavBar = lazy(() => import('./NavBar.tsx'));

import Iris from '../components/Iris/Iris.tsx';

export function Header(props: HeaderProps) {
    
    let filename = ""
    if (props.PDBCode != "") { 
        filename = props.PDBCode
    }
    else if (props.coordinateFile) { 
        filename = props.coordinateFile.name
    }

    return (
        <div className="bg-gray text-primary">
            <NavBar setResetApp={props.setResetApp}/>
            <div className="flex justify-center mb-6">
                {props.fallback !== true ?
                    <Suspense fallback={<Loading loadingText={"Loading Content..."} />}>
                        {props.submit === false ?
                            <Upload {...props} />
                                : props.results === null ?
                                    <Loading loadingText={props.loadingText} /> :
                                    <Iris results={props.results}></Iris>

                                    // <SNFG {...props} filename={filename}
                                    // ></SNFG>
                                    }
                    </Suspense>
                    : <></>
                } </div>
        </div>);
}
