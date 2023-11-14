import { jsx as _jsx } from "react/jsx-runtime";
export default function BorderElement({ topColor, bottomColor, reverse }) {
    const divStyle = {
        height: "90px",
        backgroundImage: `linear-gradient(to bottom right, ${topColor}, ${topColor} 50%, ${bottomColor} 50%, ${bottomColor})`
    };
    if (reverse) {
        divStyle['backgroundImage'] = `linear-gradient(to top right, ${bottomColor}, ${bottomColor} 50%, ${topColor} 50%, ${topColor})`;
    }
    return (_jsx("div", { style: divStyle }));
}
