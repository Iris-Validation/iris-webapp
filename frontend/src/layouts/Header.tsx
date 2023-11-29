import { lazy, Suspense } from 'react'

const Upload = lazy(() => import('../components/Upload/Upload'));
const Loading = lazy(() => import('../components/Loading/Loading'));
const NavBar = lazy(() => import('./NavBar'));

// import Iris from '../components/Iris/Iris';
import {Iris, IrisData} from "iris-validation"
import { HeaderProps } from '../interface/interface';

export function Header(props: HeaderProps) {

    const results: IrisData = {
        data: props.results,
        chain_list: null,
        file_list: props.fileNames
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
                                        <Iris results={results} from_wasm={true} ></Iris>
                                    }
                    </Suspense>
                    : <></>
                } </div>
        </div>);
}
