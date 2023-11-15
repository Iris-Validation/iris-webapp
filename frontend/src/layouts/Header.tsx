import { lazy, Suspense } from 'react'

const Upload = lazy(() => import('../components/Upload/Upload'));
const Loading = lazy(() => import('../components/Loading/Loading'));
const NavBar = lazy(() => import('./NavBar'));

import Iris from '../components/Iris/Iris';
import { HeaderProps } from '../interface/interface';

export function Header(props: HeaderProps) {
    
    // if (props.PDBCode != "") { 
    //     let filename = props.PDBCode
    // }
    // else if (props.coordinateFile) { 
    //     let filename = props.coordinateFile.name
    // }

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
                                    }
                    </Suspense>
                    : <></>
                } </div>
        </div>);
}
