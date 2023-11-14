// import './App.css'
// import iris_module from "../api/iris.js"
// import { useEffect, useState } from 'react'

// import ChainSelectionButtons from './components/ChainSelectionButtons/ChainSelectionButtons.js'
// import {calculate_poly_line, calculate_poly_line_for_circle, calculate_center_line, calculate_text_position} from "./functions/circle_functions.js"
// import {normalise_data} from "./functions/data_manipulation.js"
// import RingKnurling from './components/RingKnurling/RingKnurling'



// function extract_metric_values(results: any) {
//   let first_value = results[Object.keys(results)[0]]
//   let metrics = {}

//   // Init metric obj for however many metrics there are
//   for (let i = 0; i < first_value.length; i++) {
//     let current_data = first_value[i];
//     metrics[current_data.metric] = []
//   }

//   for (const data in results) {
//     for (let j = 0; j < results[data].length; j++) {
//       metrics[results[data][j].metric].push(results[data][j].value)
//     }
//   }

//   return metrics;
// }

// function parse_results(results: any) {
//   let result = results.result;

//   let data = {}
//   for (let i = 0; i < result.size(); i++) {
//     let chain_info = result.get(i);
//     let chain_name = chain_info.chain;
//     let results = chain_info.results;

//     let chain_data = {}
//     for (let j = 0; j < results.size(); j++) {
//       let residue_result = results.get(j);
//       if (residue_result.seqnum in chain_data) {
//         chain_data[residue_result.seqnum].push(residue_result);
//       }
//       else {
//         chain_data[residue_result.seqnum] = [residue_result];
//       }
//     }

//     data[chain_name] = chain_data;
//   }

//   return data;
// }


// function get_residue_data(results: any) {
//   let residue_names = []
//   for (const data in results) {
//     residue_names.push(`${results[data][0].name}/${results[data][0].seqnum}`)
//   }
//   return residue_names
// }

// function App() {
//   let center = [500, 500]

//   const [residueData, setResidueData] = useState<Array<any>>();
//   const [selectedResidue, setSelectedResidue] = useState();
//   const [combinedData, setCombinedData] = useState<any>();

//   const [chainListSet, setChainListSet] = useState(false);
//   const [chainList, setChainList] = useState<Array<string>>();
//   const [selectedChain, setSelectedChain] = useState();
//   const [dataLength, setDataLength] = useState();

//   const [rings, setRings] = useState();

//   const [centerLinePoints, setCenterLinePoints] = useState()

//   const [ringTextData, setRingTextData] = useState([])


//   const colours = [
//     {fill: "#ff758f", stroke: "#ff4d6d"},
//     {fill: "#1a759f", stroke: "#1e6091"},
//     {fill: "#ff758f", stroke: "#ff4d6d"},
//     {fill: "#1a759f", stroke: "#1e6091"},
//     {fill: "#1a759f", stroke: "#1e6091"},

//   ]

//   function get_current_residue(angle: number) {

//     if (residueData) {
//       let gap = residueData.length / 320
//       let delta_angle = angle - 20

//       let index = Math.floor(delta_angle * gap)

//       if (angle == 340) {
//         index = residueData.length-1
//       }

//       setSelectedResidue(residueData[index])
//     }
//   }

//   useEffect(() => {

//     iris_module().then((Module: any) => {
//       let results = Module.test();

//       let data = parse_results(results)
//       setCombinedData(data)

//       var chain_list = []
//       for (let i = 0; i < results.chain_labels.size(); i++) {
//         chain_list.push(results.chain_labels.get(i))
//       }
//       //
//       setChainListSet(true)
//       setChainList(chain_list)
//       setSelectedChain(chain_list[0])

//     })

//   }, [])


//   useEffect(() => {

//     if (!combinedData) return

//     let current_chain_data = combinedData[selectedChain]
//     if (!current_chain_data) return

//     let metrics = extract_metric_values(current_chain_data)

//     let max_radius = 400;
//     let current_radius = max_radius;

//     let current_rings = []
//     let current_ring_text = []
//     let dataLength = 0;
//     for (const metric in metrics) {
//       let normalised = normalise_data(metrics[metric])
//       const polyline = calculate_poly_line(center, current_radius, normalised)
//       const center_ring = calculate_poly_line_for_circle(center, current_radius)
//       const points = polyline + center_ring;

//       let residue_data = get_residue_data(current_chain_data)
//       setResidueData(residue_data)
//       let ring_text_pos = calculate_text_position(center, metric, current_radius)
//       current_ring_text.push([...ring_text_pos, metric])
//       current_rings.push(points)
//       current_radius -= 50
//       dataLength = normalised.length

//     }
//     setDataLength(dataLength)
//     setRings(current_rings)
//     setRingTextData(current_ring_text)

//   }, [selectedChain])

//   function handle_mouse_move(e) {
//     var svg = document.getElementById("svg");
//     var bounds = svg.getBoundingClientRect();
//     var x = e.clientX - bounds.x;
//     var y = e.clientY - bounds.y;

//     var delta_x = x - center[0]
//     var delta_y = y - center[1]

//     var angle = (180 / Math.PI) * Math.atan2(delta_y, delta_x) + 90

//     if (angle > 0 && angle < 20) {
//       angle = 20
//     }

//     if (-20 < angle && angle < 0) {
//       angle = 340
//     }

//     // normalise angles
//     if (angle < 0) {
//       angle += 360
//     }

//     if (residueData) {
//       let gap = 320 / residueData.length
//       // console.log(residueData.length, gap)
//       // angle = Math.ceil(angle/gap)*gap
//     }


//     let highlighted_residue = get_current_residue(angle)

//     let center_line = calculate_center_line(center, angle, 450)
//     setCenterLinePoints(center_line)
//   }

//   const chainSelectionButtonsProps = {
//     chainList: chainList,
//     chainListSet: chainListSet,
//     selectedChain: selectedChain,
//     setSelectedChain: setSelectedChain,
//   }

//   const ringKurnlingProps = {
//     center: [500,500],
//     header: 40 ,
//     radius: 450,
//     number: dataLength,
//   }

//   return (
//     <div className='flex-col'>

//       <div className='flex h-12'>
//         <span className='text-xl h-full align-middle text-center'>Chain</span>
//         <ChainSelectionButtons {...chainSelectionButtonsProps}/>

//         <span className='text-xl text-white'>{selectedResidue}</span>
//       </div>

//       <svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnssvgjs="http://svgjs.dev/svgjs" width="1000" height="1000" viewBox="0 0 1000 1000" onMouseMove={(e) => { handle_mouse_move(e) }}>

//         <RingKnurling {...ringKurnlingProps}/>

//         {ringTextData ?
//           ringTextData.map((item, index) => {
//             return <text x={item[0]} y={item[1]} fill='gray' key={index}>{item[2]}</text>
//           }):
//             <></>
//         }

//         {rings ?
//           rings.map((item, index) => {
//             return <polyline points={item} fill={colours[index].fill} strokeWidth="1" stroke={colours[index].stroke} fillOpacity={0.2} fillRule="evenodd" key={index}/>
//           })
//             : <>No rings</>
//         }

//         <polyline points={centerLinePoints} fill="gray" strokeWidth="1" stroke="gray" />

//       </svg>
//     </div>
//   )
// }

// export default App

import { useEffect, useState, Suspense } from 'react'
import './App.css'
import HomeSection from './pages/Home'
import PageLoad from './components/Loading/PageLoad'

function App() {
  return (
    <Suspense fallback={<PageLoad/>}>

      <div className='flex flex-col'>
        <HomeSection />
      </div>
    </Suspense>
  )
}

export default App
