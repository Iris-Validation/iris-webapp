
// import ChainSelectionButtons from '../ChainSelectionButtons/ChainSelectionButtons.js'
// import { calculate_poly_line, calculate_poly_line_for_circle, calculate_center_line, calculate_text_position } from "../../functions/circle_functions.js"
// import { normalise_data } from "../../functions/data_manipulation.js"
// import RingKnurling from '../RingKnurling/RingKnurling'
// import { useEffect, useState } from 'react'
// import { IrisProps, Metric } from '../../interface/interface'

// function extract_metric_values(results: any) {
//     let metrics: Record<string, Metric> = {}

//     for (const data in results) {
//         for (let j = 0; j < results[data].length; j++) {
//             if (results[data][j].metric in metrics) {
//                 metrics[results[data][j].metric].array.push(results[data][j].value)
//             }
//             else {
//                 metrics[results[data][j].metric] = { array: [results[data][j].value], type: results[data][j].type }
//             }
//         }
//     }

//     return metrics;
// }

// function parse_results(results: any) {

//     let data: Record<string, Record<string, Record<string, Array<number>>>> = {}

//     for (let result_index = 0; result_index < results.size(); result_index++) {

//         let result_info = results.get(result_index);
//         let result = result_info.result;
//         data[result_info.file_name] = {}
//         for (let i = 0; i < result.size(); i++) {

//             let chain_info = result.get(i);
//             let chain_name = chain_info.chain;
//             let results = chain_info.results;
//             let chain_data: Record<string, Array<number>> = {}
//             for (let j = 0; j < results.size(); j++) {
//                 let residue_result = results.get(j);
//                 if (residue_result.seqnum in chain_data) {
//                     chain_data[residue_result.seqnum].push(residue_result);
//                 }
//                 else {
//                     chain_data[residue_result.seqnum] = [residue_result];
//                 }
//             }

//             data[result_info.file_name][chain_name] = chain_data;
//         }
//     }

//     return data;
// }


// function get_residue_data(results: any) {
//     let residue_names = []
//     for (const data in results) {
//         residue_names.push(`${results[data][0].name}/${results[data][0].seqnum}`)
//     }
//     return residue_names
// }

// export default function Iris(props: IrisProps) {

//     let center = [500, 500]

//     const [residueData, setResidueData] = useState<Array<any>>();
//     const [selectedResidue, setSelectedResidue] = useState();
//     const [combinedData, setCombinedData] = useState<any>();

//     const [chainListSet, setChainListSet] = useState(false);
//     const [chainList, setChainList] = useState<Array<string>>([""]);
//     const [selectedChain, setSelectedChain] = useState<string>("");

//     const [fileList, setFileList] = useState<Array<string>>([""]);
//     const [selectedFile, setSelectedFile] = useState<string>("");

//     const [dataLength, setDataLength] = useState<number>();

//     const [rings, setRings] = useState<Array<any>>();

//     const [centerLinePoints, setCenterLinePoints] = useState<string>()

//     const [ringTextData, setRingTextData] = useState<Array<Array<any>>>()


//     const colours = [
//         { fill: "#FF8B85", stroke: "#FF8B85" },
//         { fill: "#F5AF00", stroke: "#F5AF00" },
//         { fill: "#72C0A6", stroke: "#72C0A6" },
//         { fill: "#9FB0D0", stroke: "#9FB0D0" },
//         { fill: "#9A8ABC", stroke: "#9A8ABC" },
//     ]

//     function get_current_residue(angle: number) {

//         if (residueData) {
//             let gap = residueData.length / 320
//             let delta_angle = angle - 20

//             let index = Math.floor(delta_angle * gap)

//             if (angle == 340) {
//                 index = residueData.length - 1
//             }

//             setSelectedResidue(residueData[index])
//         }
//     }

//     useEffect(() => {

//         let data = parse_results(props.results)
//         setCombinedData(data)

//         var chain_list = []
//         // @ts-ignore
//         for (let i = 0; i < props.results.get(0).chain_labels.size(); i++) {
//             // @ts-ignore
//             chain_list.push(props.results.get(0).chain_labels.get(i))
//         }
//         //
//         setChainListSet(true)
//         setChainList(chain_list)
//         setSelectedChain(chain_list[0])

//         setFileList(Object.keys(data))
//         setSelectedFile(Object.keys(data)[0])

//     }, [])


//     useEffect(() => {

//         if (!combinedData) return
//         if (!selectedChain) return

//         let current_selected_chain = selectedChain;
//         let new_file_chains = Object.keys(combinedData[selectedFile])
//         setChainList(new_file_chains)
//         for (const chain in new_file_chains) {
//             if (new_file_chains[chain] == current_selected_chain) {
//                 setSelectedChain(new_file_chains[chain])
//                 break;
//             }
//             else {
//                 setSelectedChain(new_file_chains[0])
//             }
//         }


//         let current_chain_data = combinedData[selectedFile][selectedChain]
//         if (!current_chain_data) return

//         let metrics = extract_metric_values(current_chain_data)

//         let max_radius = 400;
//         let current_radius = max_radius;

//         let current_rings = []
//         let current_ring_text = []
//         let dataLength = 0;

//         for (const metric in metrics) {

//             let normalised = normalise_data(metrics[metric].array)
//             let polyline = calculate_poly_line(center, current_radius, normalised)

//             const center_ring = calculate_poly_line_for_circle(center, current_radius)
//             const points = polyline + center_ring;

//             let residue_data = get_residue_data(current_chain_data)
//             setResidueData(residue_data)

//             let ring_text_pos = calculate_text_position(center, metric, current_radius)
//             current_ring_text.push([...ring_text_pos, metric])

//             current_rings.push(points)
//             current_radius -= 50

//             dataLength = normalised.length

//         }
//         setDataLength(dataLength)
//         setRings(current_rings)
//         setRingTextData(current_ring_text)

//     }, [selectedChain, selectedFile])

//     function handle_mouse_move(e: any) {
//         var svg = document.getElementById("svg");
//         if (!svg) return
//         var bounds = svg.getBoundingClientRect();
//         var x = e.clientX - bounds.x;
//         var y = e.clientY - bounds.y;

//         var delta_x = x - center[0]
//         var delta_y = y - center[1]

//         var angle = (180 / Math.PI) * Math.atan2(delta_y, delta_x) + 90

//         if (angle > 0 && angle < 20) {
//             angle = 20
//         }

//         if (-20 < angle && angle < 0) {
//             angle = 340
//         }

//         // normalise angles
//         if (angle < 0) {
//             angle += 360
//         }

//         // if (residueData) {
//         //     let gap = 320 / residueData.length
//         //     // console.log(residueData.length, gap)
//         //     // angle = Math.ceil(angle/gap)*gap
//         // }


//         get_current_residue(angle)

//         let center_line = calculate_center_line(center, angle, 450)
//         setCenterLinePoints(center_line)
//     }

//     const chainSelectionButtonsProps = {
//         chainList: chainList,
//         chainListSet: chainListSet,
//         selectedChain: selectedChain,
//         setSelectedChain: setSelectedChain,
//     }

//     const ringKurnlingProps = {
//         center: [500, 500],
//         header: 40,
//         radius: 450,
//         number: dataLength ? dataLength : 0,
//     }

//     return (
//         <div className='flex-col'>

//             <div className='flex h-12 text-center align-middle justify-center'>
//                 <span className='text-xl h-full align-middle text-center mr-2 my-2'>Chain</span>
//                 <ChainSelectionButtons {...chainSelectionButtonsProps} />

//                 <span className='text-xl text-white ml-16 my-2 w-64'>Residue: {selectedResidue}</span>

//                 {fileList.length > 1 ? <div className='flex align-middle h-6 my-auto'>

//                     <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300 text-ellipsis overflow-hidden">{props.fileNames[0]}</span>

//                     <label className="relative inline-flex items-center cursor-pointer">
//                         <input type="checkbox" value="" className="sr-only peer" onClick={() => {
//                         if (fileList[0] == selectedFile) {
//                             setSelectedFile(fileList[1])
//                         } else {
//                             setSelectedFile(fileList[0])
//                         }

//                     }} />
//                         <div className="w-11 h-6 bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                     </label>

//                     <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 text-ellipsis overflow-hidden">{props.fileNames[1]}</span>

//                     </div>
//                     :
//                     <></>
//                 }

//             </div>

//             <svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="1000" height="1000" viewBox="0 0 1000 1000" onMouseMove={(e) => { handle_mouse_move(e) }}>

//                 <RingKnurling {...ringKurnlingProps} />

//                 {ringTextData ?
//                     ringTextData.map((item, index) => {
//                         return <text x={item[0]} y={item[1]} fill='gray' key={index}>{item[2]}</text>
//                     }) :
//                     <></>
//                 }

//                 {rings ?
//                     rings.map((item, index) => {
//                         return <polyline points={item} fill={colours[index].fill} strokeWidth="1" stroke={colours[index].stroke} fillOpacity={0.2} fillRule="evenodd" key={index} />
//                     })
//                     : <>No rings</>
//                 }

//                 <polyline points={centerLinePoints} fill="gray" strokeWidth="1" stroke="gray" />

//             </svg>
//         </div>
//     )
// }