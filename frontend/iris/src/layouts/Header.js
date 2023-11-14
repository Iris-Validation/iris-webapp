import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
const Upload = lazy(() => import('../components/Upload/Upload.tsx'));
const Loading = lazy(() => import('../components/Loading/Loading.tsx'));
const NavBar = lazy(() => import('./NavBar.tsx'));
import Iris from '../components/Iris/Iris.tsx';
export function Header(props) {
    let filename = "";
    if (props.PDBCode != "") {
        filename = props.PDBCode;
    }
    else if (props.coordinateFile) {
        filename = props.coordinateFile.name;
    }
    return (_jsxs("div", { className: "bg-gray text-primary", children: [_jsx(NavBar, { setResetApp: props.setResetApp }), _jsxs("div", { className: "flex justify-center mb-6", children: [props.fallback !== true ?
                        _jsx(Suspense, { fallback: _jsx(Loading, { loadingText: "Loading Content..." }), children: props.submit === false ?
                                _jsx(Upload, { ...props })
                                : props.results === null ?
                                    _jsx(Loading, { loadingText: props.loadingText }) :
                                    _jsx(Iris, { results: props.results }) })
                        : _jsx(_Fragment, {}), " "] })] }));
}
