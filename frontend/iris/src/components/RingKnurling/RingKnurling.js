import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function RingKnurling(props) {
    let start_point = props.header / 2;
    let range = 360 - props.header;
    let points = [];
    let line_length = 10;
    let outer_ring = [];
    let inner_ring = [];
    for (let i = 0; i < props.number; i++) {
        let angle = ((i * range / props.number) + start_point) * (Math.PI / 180);
        const x1 = props.center[0] + props.radius * Math.sin(angle);
        const y1 = props.center[1] - props.radius * Math.cos(angle);
        const x2 = props.center[0] + ((props.radius + line_length) * Math.sin(angle));
        const y2 = props.center[1] - ((props.radius + line_length) * Math.cos(angle));
        let point = `${x1},${y1} ${x2},${y2}`;
        points.push(point);
    }
    return (_jsxs("g", { children: [points.map((item, index) => {
                return (_jsx("polyline", { points: item, fill: "gray", strokeWidth: "1", stroke: "gray", fillRule: "evenodd" }, index));
            }), _jsx("circle", { cx: props.center[0], cy: props.center[1], r: props.radius, fill: "none", stroke: "gray" }), _jsx("circle", { cx: props.center[0], cy: props.center[1], r: props.radius + line_length, fill: "none", stroke: "gray" })] }));
}
