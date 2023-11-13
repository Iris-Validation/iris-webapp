

export default function RingKnurling({ header, radius, number, center}) {

    let start_point = header / 2
    let end_point = 360 - start_point

    let points: any[] = []
    let line_length = 10

    for (let i = start_point; i < end_point; i++) {
        let angle = i * (Math.PI/180)

        const x1 = center[0] + radius * Math.sin(angle)
        const y1 = center[1] - radius * Math.cos(angle)

        const x2 = center[0] + ((radius + line_length) * Math.sin(angle))
        const y2 = center[1] - ((radius + line_length) * Math.cos(angle)
)
        let point = `${x1},${y1} ${x2},${y2}`
        points.push(point)
    }


    return (
        <g>{
            points.map((item: string | undefined, index: number ) => {
                return (<polyline points={item}  fill="gray" strokeWidth="1" stroke="gray" fillRule="evenodd" key={index}/>)
            })
        }
        </g>
    )
}