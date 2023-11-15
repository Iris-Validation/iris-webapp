import { BorderElementProps } from "../interface/interface";

export default function BorderElement(props: BorderElementProps) {

    const divStyle = {
        height: "90px",
        backgroundImage: `linear-gradient(to bottom right, ${props.topColor}, ${props.topColor} 50%, ${props.bottomColor} 50%, ${props.bottomColor})`
    };

    if (props.reverse) {
        divStyle['backgroundImage'] = `linear-gradient(to top right, ${props.bottomColor}, ${props.bottomColor} 50%, ${props.topColor} 50%, ${props.topColor})`
    }

    return (
        <div style={divStyle}></div>
    )
}