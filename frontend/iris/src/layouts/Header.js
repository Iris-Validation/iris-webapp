import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
const _jsxFileName = "/Users/dialpuri/Development/iris-webapp/frontend/iris/src/layouts/Header.tsx";
import { lazy, Suspense } from 'react';
const Upload = lazy(() => import('../components/Upload/Upload'));
const Loading = lazy(() => import('../components/Loading/Loading'));
const NavBar = lazy(() => import('./NavBar'));
import Iris from '../components/Iris/Iris';
export function Header(props) {
    // if (props.PDBCode != "") { 
    //     let filename = props.PDBCode
    // }
    // else if (props.coordinateFile) { 
    //     let filename = props.coordinateFile.name
    // }
    return (_jsxDEV("div", { className: "bg-gray text-primary", children: [_jsxDEV(NavBar, { setResetApp: props.setResetApp }, void 0, false, { fileName: _jsxFileName, lineNumber: 21, columnNumber: 13 }, this), _jsxDEV("div", { className: "flex justify-center mb-6", children: [props.fallback !== true ?
                        _jsxDEV(Suspense, { fallback: _jsxDEV(Loading, { loadingText: "Loading Content..." }, void 0, false, { fileName: _jsxFileName, lineNumber: 24, columnNumber: 41 }, this), children: props.submit === false ?
                                _jsxDEV(Upload, { ...props }, void 0, false, { fileName: _jsxFileName, lineNumber: 25, columnNumber: 50 }, this)
                                : props.results === null ?
                                    _jsxDEV(Loading, { loadingText: props.loadingText }, void 0, false, { fileName: _jsxFileName, lineNumber: 27, columnNumber: 59 }, this) :
                                    _jsxDEV(Iris, { results: props.results }, void 0, false, { fileName: _jsxFileName, lineNumber: 28, columnNumber: 82 }, this) }, void 0, false, { fileName: _jsxFileName, lineNumber: 23, columnNumber: 43 }, this)
                        : _jsxDEV(_Fragment, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 32, columnNumber: 22 }, this), " "] }, void 0, true, { fileName: _jsxFileName, lineNumber: 22, columnNumber: 13 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 19, columnNumber: 13 }, this));
}
