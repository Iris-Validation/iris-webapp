import {RingKnurlingType} from "../../interface/interface"

export default function RingKnurling(props: RingKnurlingType) {

    let start_point = props.header / 2
    let range = 360 - props.header

    let points: any[] = []
    let line_length = 10
    // let outer_ring: any[] = []
    // let inner_ring: any[] = []

    for (let i = 0; i < props.number; i++) {

        let angle = ((i * range / props.number) + start_point) * (Math.PI / 180)

        const x1 = props.center[0] + props.radius * Math.sin(angle)
        const y1 = props.center[1] - props.radius * Math.cos(angle)

        const x2 = props.center[0] + ((props.radius + line_length) * Math.sin(angle))
        const y2 = props.center[1] - ((props.radius + line_length) * Math.cos(angle))

        let point = `${x1},${y1} ${x2},${y2}`
        points.push(point)
        
    }

    return (
        <g>
            {
                points.map((item: string | undefined, index: number) => {
                    return (<polyline points={item} fill="gray" strokeWidth="1" stroke="gray" fillRule="evenodd" key={index} />)
                })
            }

            <circle cx={props.center[0]} cy={props.center[1]} r={props.radius} fill="none" stroke="gray" />
            <circle cx={props.center[0]} cy={props.center[1]} r={props.radius+line_length} fill="none" stroke="gray" />

        </g>
    )
}