import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "/Users/dialpuri/Development/iris-webapp/frontend/iris/src/components/RingKnurling/RingKnurling.tsx";
export default function RingKnurling(props) {
    let start_point = props.header / 2;
    let range = 360 - props.header;
    let points = [];
    let line_length = 10;
    // let outer_ring: any[] = []
    // let inner_ring: any[] = []
    for (let i = 0; i < props.number; i++) {
        let angle = ((i * range / props.number) + start_point) * (Math.PI / 180);
        const x1 = props.center[0] + props.radius * Math.sin(angle);
        const y1 = props.center[1] - props.radius * Math.cos(angle);
        const x2 = props.center[0] + ((props.radius + line_length) * Math.sin(angle));
        const y2 = props.center[1] - ((props.radius + line_length) * Math.cos(angle));
        let point = `${x1},${y1} ${x2},${y2}`;
        points.push(point);
    }
    return (_jsxDEV("g", { children: [points.map((item, index) => {
                return (_jsxDEV("polyline", { points: item, fill: "gray", strokeWidth: "1", stroke: "gray", fillRule: "evenodd" }, index, false, { fileName: _jsxFileName, lineNumber: 32, columnNumber: 29 }, this));
            }), _jsxDEV("circle", { cx: props.center[0], cy: props.center[1], r: props.radius, fill: "none", stroke: "gray" }, void 0, false, { fileName: _jsxFileName, lineNumber: 36, columnNumber: 13 }, this), _jsxDEV("circle", { cx: props.center[0], cy: props.center[1], r: props.radius + line_length, fill: "none", stroke: "gray" }, void 0, false, { fileName: _jsxFileName, lineNumber: 37, columnNumber: 13 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 28, columnNumber: 13 }, this));
}
