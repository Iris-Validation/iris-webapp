import './App.css'
import iris_module from "../api/iris.js"
import { useEffect, useState } from 'react'

import ChainSelectionButtons from './components/ChainSelectionButtons/ChainSelectionButtons.js'
import {calculate_poly_line, calculate_poly_line_for_circle, calculate_center_line, calculate_text_position} from "./functions/circle_functions.js"
import {normalise_data} from "./functions/data_manipulation.js"
import RingKnurling from './components/RingKnurling/RingKnurling'

function parse_result(results: any) {
  let result = results.result;
  let data = {}

  for (let i = 0; i < result.size(); i++) {
    let chain_result = result.get(i);
    let chain_id = chain_result.chain;
    data[chain_id] = []

    for (let j = 0; j < chain_result.results.size(); j++) {
      let residue_result = chain_result.results.get(j);
      let name = residue_result.name;
      let value = residue_result.value;

      data[chain_id].push({ id: j, res_name: name, value: value })

    }
  }
  return data;
}

function get_values(dataset: any, chain: string) {
  let values = []
  for (let i = 0; i < dataset[chain].length; i++) {
    values.push(dataset[chain][i].value)
  }
  return values
}

function get_residue_data(results: any) {
  let residue_names = []
  for (let i = 0; i < results.length; i++) {
    residue_names.push(`${results[i].res_name}/${i + 1}`)
  }
  return residue_names
}


function App() {
  let center = [500, 500]

  const [averageBFactorData, setAverageBFactorData] = useState<Array<any>>();
  const [maxBFactorData, setMaxBFactorData] = useState<Array<any>>();
  const [residueData, setResidueData] = useState<Array<any>>();
  const [selectedResidue, setSelectedResidue] = useState();

  const [chainListSet, setChainListSet] = useState(false);
  const [chainList, setChainList] = useState<Array<string>>();
  const [selectedChain, setSelectedChain] = useState();

  const [avgBFacPoints, setAvgBFacPoints] = useState();
  const [maxBFacPoints, setMaxBFacPoints] = useState();
  const [centerLinePoints, setCenterLinePoints] = useState()

  const [ringOneTextPos, setRingOneTextPos] = useState(null)
  const [ringTwoTextPos, setRingTwoTextPos] = useState(null)


  function get_current_residue(angle: number) {

    if (residueData) {
      let gap = residueData.length / 320
      let delta_angle = angle - 20

      let index = Math.floor(delta_angle * gap)
      
      if (angle == 340) { 
        index = residueData.length-1
      }

      setSelectedResidue(residueData[index])
    }
  }

  useEffect(() => {

    iris_module().then((Module: any) => {
      let results = Module.test();

      let avg_b_factor_data = parse_result(results.average_b_factor);
      let max_b_factor_data = parse_result(results.max_b_factor);

      setAverageBFactorData(avg_b_factor_data)
      setMaxBFactorData(max_b_factor_data)

      var chain_list = []
      for (let i = 0; i < results.chain_labels.size(); i++) {
        chain_list.push(results.chain_labels.get(i))
      }

      setChainListSet(true)
      setChainList(chain_list)
      setSelectedChain(chain_list[0])


      let center_line = calculate_center_line(center, 20, 450)
      setCenterLinePoints(center_line)

    })

  }, [])


  useEffect(() => {
    if (averageBFactorData) {
      let radius = 400
      let values = get_values(averageBFactorData, selectedChain)
      let normalised = normalise_data(values)
      const pl = calculate_poly_line(center, radius, normalised)
      const ring = calculate_poly_line_for_circle(center, radius)
      const points = pl + ring

      setAvgBFacPoints(points)

      let residue_data = get_residue_data(averageBFactorData[selectedChain])
      setResidueData(residue_data)

      let text_pos = calculate_text_position(center, "Average B Factor", radius)
      setRingOneTextPos(text_pos)
    }

    if (maxBFactorData) {
      let radius = 350
      let values = get_values(maxBFactorData, selectedChain)
      let normalised = normalise_data(values)
      const pl = calculate_poly_line(center, radius, normalised)
      const ring = calculate_poly_line_for_circle(center, radius)
      const points = pl + ring

      setMaxBFacPoints(points)

      let text_pos = calculate_text_position(center, "Max B Factor", radius)
      setRingTwoTextPos(text_pos)
    }

  }, [selectedChain])

  function handle_mouse_move(e) {
    var svg = document.getElementById("svg");
    var bounds = svg.getBoundingClientRect();
    var x = e.clientX - bounds.x;
    var y = e.clientY - bounds.y;

    var delta_x = x - center[0]
    var delta_y = y - center[1]

    var angle = (180 / Math.PI) * Math.atan2(delta_y, delta_x) + 90

    if (angle > 0 && angle < 20) {
      angle = 20
    }

    if (-20 < angle && angle < 0) {
      angle = 340
    }

    // normalise angles
    if (angle < 0) {
      angle += 360
    }

    let highlighted_residue = get_current_residue(angle)

    let center_line = calculate_center_line(center, angle, 450)
    setCenterLinePoints(center_line)
  }

  const chainSelectionButtonsProps = {
    chainList: chainList,
    chainListSet: chainListSet,
    setSelectedChain: setSelectedChain, 
  }

  return (
    <div className='flex-col'>

      <div className='flex'>
        <ChainSelectionButtons {...chainSelectionButtonsProps}/>

        <span className='text-xl text-white'>{selectedResidue}</span>
      </div>

      <svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnssvgjs="http://svgjs.dev/svgjs" width="1000" height="1000" viewBox="0 0 1000 1000" onMouseMove={(e) => { handle_mouse_move(e) }}>
        
        {ringOneTextPos !== null ? 
              <text x={ringOneTextPos[0]} y={ringOneTextPos[1]} fill='white'>{ringOneTextPos[2]}</text>: <></>
        }

        {ringTwoTextPos !== null ? 
              <text x={ringTwoTextPos[0]} y={ringTwoTextPos[1]} fill='white'>{ringTwoTextPos[2]}</text>: <></>
        }

        <RingKnurling center={[500,500]} header={40} radius={450} number={839}/>

        <polyline points={avgBFacPoints} fill="#ff758f" strokeWidth="1" stroke="#ff4d6d" fillRule="evenodd" />
        <polyline points={maxBFacPoints} fill="#1a759f" strokeWidth="1" stroke="#1e6091" fillRule="evenodd" />
        <polyline points={centerLinePoints} fill="gray" strokeWidth="1" stroke="gray" />
        
      </svg>
    </div>
  )
}

export default App
