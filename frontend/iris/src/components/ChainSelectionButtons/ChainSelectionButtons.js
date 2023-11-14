import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
export default function ChainSelectionButtons(props) {
    return (_jsx("div", { className: 'flex transition-al text-center align-center justify-center', children: props.chainListSet !== true ? _jsx(_Fragment, { children: "Loading..." }) : props.chainList.map((item, index) => {
            return (_jsx("button", { className: item == props.selectedChain ? 'mx-2 w-12 h-12 text-center align-middle px-1 py-1 rounded-md text-primary border-2 bg-secondary hover:bg-tertiary' : 'mx-2 w-12 h-12 rounded-md text-center align-middle px-1 py-1 border-2 text-primary bg-gray hover:bg-gray', onClick: () => { props.setSelectedChain(item); }, children: item }, index));
        }) }));
}
