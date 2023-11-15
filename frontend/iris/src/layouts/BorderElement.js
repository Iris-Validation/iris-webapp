import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "/Users/dialpuri/Development/iris-webapp/frontend/iris/src/layouts/BorderElement.tsx";
export default function BorderElement(props) {
    const divStyle = {
        height: "90px",
        backgroundImage: `linear-gradient(to bottom right, ${props.topColor}, ${props.topColor} 50%, ${props.bottomColor} 50%, ${props.bottomColor})`
    };
    if (props.reverse) {
        divStyle['backgroundImage'] = `linear-gradient(to top right, ${props.bottomColor}, ${props.bottomColor} 50%, ${props.topColor} 50%, ${props.topColor})`;
    }
    return (_jsxDEV("div", { style: divStyle }, void 0, false, { fileName: _jsxFileName, lineNumber: 14, columnNumber: 13 }, this));
}
