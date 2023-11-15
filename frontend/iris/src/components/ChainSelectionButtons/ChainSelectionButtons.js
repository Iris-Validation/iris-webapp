import { Fragment as _Fragment, jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "/Users/dialpuri/Development/iris-webapp/frontend/iris/src/components/ChainSelectionButtons/ChainSelectionButtons.tsx";
export default function ChainSelectionButtons(props) {
    return (_jsxDEV("div", { className: 'flex transition-al text-center align-center justify-center', children: props.chainListSet !== true ? _jsxDEV(_Fragment, { children: "Loading..." }, void 0, false, { fileName: _jsxFileName, lineNumber: 6, columnNumber: 41 }, this) : props.chainList.map((item, index) => {
            return (_jsxDEV("button", { className: item == props.selectedChain ? 'mx-2 w-12 h-12 text-center align-middle px-1 py-1 rounded-md text-primary border-2 bg-secondary hover:bg-tertiary' : 'mx-2 w-12 h-12 rounded-md text-center align-middle px-1 py-1 border-2 text-primary bg-gray hover:bg-gray', onClick: () => { props.setSelectedChain(item); }, children: item }, index, false, { fileName: _jsxFileName, lineNumber: 7, columnNumber: 21 }, this));
        }) }, void 0, false, { fileName: _jsxFileName, lineNumber: 4, columnNumber: 13 }, this));
}
