import { lazy, Suspense, useState, useEffect } from 'react'

const Upload = lazy(() => import('../components/Upload/Upload'));
const Loading = lazy(() => import('../components/Loading/Loading'));
const NavBar = lazy(() => import('./NavBar'));

// import Iris from '../components/Iris/Iris';
import { Iris, IrisData, IrisAesthetics, IrisProps } from "iris-validation"
import { HeaderProps } from '../interface/interface';

export function Header(props: HeaderProps) {

    // const dimensions = [window.innerHeight, window.innerHeight]
    // const center = [Math.floor(window.innerHeight / 2),
    //                                       Math.floor(window.innerHeight / 2)]
    const min_dimension = Math.min(window.innerHeight, window.innerWidth)
    const [dimensions, setDimensions] = useState([min_dimension, min_dimension])

    // const [maxRadius, _] = useState((min_dimension / 2) - 20)
    // const max_radius = center[0]-20
    const radius_change = 50
    // const radius_change = 20

    
    useEffect(() => {
        const handleResize = () => {
            const min_dimension = Math.min(window.innerHeight, window.innerWidth)
            setDimensions([min_dimension, min_dimension]);
            // setCenter([Math.floor(max_dimension / 2), Math.floor(max_dimension / 2)])
            // setMaxRadius(Math.floor(min_dimension / 2) - (min_dimension/15))
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const aes: IrisAesthetics = {
        dimensions: dimensions,
        radius_change: radius_change,
        header: 40,
        text_size: 120
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
        click_callback: (_) => {
            // console.log("RESIDUE CLICKED", residue)
        },
        hover_callback: (_) => {

        }
    }

    return (
        <div className="bg-gray text-primary">
            <NavBar setResetApp={props.setResetApp} />
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
