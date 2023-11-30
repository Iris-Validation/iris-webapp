import { lazy, Suspense } from 'react'

const Upload = lazy(() => import('../components/Upload/Upload'));
const Loading = lazy(() => import('../components/Loading/Loading'));
const NavBar = lazy(() => import('./NavBar'));

// import Iris from '../components/Iris/Iris';
import {Iris, IrisData, IrisAesthetics, IrisProps} from "iris-validation"
import { HeaderProps } from '../interface/interface';

export function Header(props: HeaderProps) {

    const aes: IrisAesthetics = {
        dimensions: [1000,1000],
        center:[500,500], 
        max_radius: 490, 
        radius_change: 50, 
        header: 40
    }

    const results: IrisData = {
        data: props.results,
        chain_list: null,
        file_list: props.fileNames,
    }

    const iris_props: IrisProps = { 
        results: results,
        from_wasm: true,
        aesthetics: aes, 
        callback: (_) => { 
            // console.log("RESIDUE CLICKED", residue)
        }
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
                                        <Iris {...iris_props}></Iris>
                                    }
                    </Suspense>
                    : <></>
                } </div>
        </div>);
}
