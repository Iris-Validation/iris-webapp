import './App.css'
import iris_module from "../api/iris.js"
import { useEffect, useState } from 'react'
import { SVG, Svg } from '@svgdotjs/svg.js'
import styles from "./index.css"

function calculate_poly_line(center: Array<number>, radius: number, data: Array<number>) {
  const header = 40
  const gap = (360 - header) / data.length

  var poly_list = ''

  for (var i = 1; i < data.length; i++) {
    let angle = (header / 2 + gap * i) * (Math.PI / 180)

    if (i == 1) {
      const x = center[0] + radius * Math.sin(angle)
      const y = center[1] - radius * Math.cos(angle)
      poly_list += x
      poly_list += ","
      poly_list += y
      poly_list += " "
    }

    const x = center[0] + (data[i] + radius) * Math.sin(angle)
    const y = center[1] - (data[i] + radius) * Math.cos(angle)
    poly_list += x
    poly_list += ","
    poly_list += y
    poly_list += " "

    if (i == data.length - 1) {
      const x = center[0] + radius * Math.sin(angle)
      const y = center[1] - radius * Math.cos(angle)
      poly_list += x
      poly_list += ","
      poly_list += y
      poly_list += " "
    }
  }
  return poly_list
}

function calculate_poly_line_for_circle(center: Array<number>, radius: number) {
  const header = 40
  const gap = (360 - header)

  var poly_list = ''

  for (var i = gap; i > 0; i--) {

    let angle = (header / 2 + i) * (Math.PI / 180)
    const x = center[0] + radius * Math.sin(angle)
    const y = center[1] - radius * Math.cos(angle)
    poly_list += x
    poly_list += ","
    poly_list += y
    poly_list += " "
  }
  return poly_list
}

function generate_test_data(length: number, amplitude: number) {
  const arr = Array.from({ length: length }, () => Math.random() * amplitude);
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  var avg = total / arr.length;

  const norm = arr.map((e) => {
    return - e - avg
  })
  return norm
}

function normalise_data(arr: Array<number>) {

  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  var avg = total / arr.length;

  const norm = arr.map((e) => {
    return avg - e
  })
  return norm
}

function generate_circle(diameter: number, canvas: Svg) {
  canvas.circle(diameter)
    .center(0, 0)
    .fill('none')
    .stroke({
      width: 0.5,
      color: 'white'
    })
}

function generate_test_ring(diameter: number, amplitude: number, canvas: Svg) {
  const radius = diameter / 2

  const norm1 = generate_test_data(360, amplitude)
  // generate_circle(diameter, canvas)
  const pl = calculate_poly_line(radius, norm1)
  const ring = calculate_poly_line_for_circle(radius)
  const points = pl + ring
  console.log(points)
  canvas.polyline(points)
    .fill('blue')
    .stroke({
      width: 0.5,
      color: 'red'
    })
    .attr({
      'fill-rule': 'evenodd'
    })
}


function generate_ring(diameter: number, data: Array<number>, canvas: Svg) {
  const radius = diameter / 2

  const norm1 = normalise_data(data)
  // generate_circle(diameter, canvas)
  const pl = calculate_poly_line(radius, norm1)
  const ring = calculate_poly_line_for_circle(radius)
  const points = pl + ring

  canvas.polyline(points)
    .fill('blue')
    .stroke({
      width: 0.5,
      color: 'red'
    })
    .attr({
      'fill-rule': 'evenodd'
    })
}

function parse_result(results: any) {
  console.log(results.result)
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

function calculate_center_line(center: Array<number>, angle: number, radius: number) {
  angle = angle * (Math.PI / 180)
  const x = center[0] + radius * Math.sin(angle)
  const y = center[1] - radius * Math.cos(angle)
  return `${center[0]},${center[1]} ${x},${y}`
}

function get_residue_data(results: any) {
  console.log(results);
  let residue_names = []
  for (let i = 0; i < results.length; i++) {
    residue_names.push(`${results[i].res_name}/${i + 1}`)
  }
  return residue_names
}



function App() {
  let center = [500, 500]

  const [averageBFactorData, setAverageBFactorData] = useState();
  const [maxBFactorData, setMaxBFactorData] = useState();
  const [residueData, setResidueData] = useState();
  const [selectedResidue, setSelectedResidue] = useState();

  const [chainListSet, setChainListSet] = useState(false);
  const [chainList, setChainList] = useState(false);
  const [selectedChain, setSelectedChain] = useState();

  const [avgBFacPoints, setAvgBFacPoints] = useState();
  const [maxBFacPoints, setMaxBFacPoints] = useState();
  const [centerLinePoints, setCenterLinePoints] = useState()

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
      let values = get_values(averageBFactorData, selectedChain)
      let normalised = normalise_data(values)
      const pl = calculate_poly_line(center, 400, normalised)
      const ring = calculate_poly_line_for_circle(center, 400)
      const points = pl + ring

      setAvgBFacPoints(points)

      let residue_data = get_residue_data(averageBFactorData[selectedChain])
      setResidueData(residue_data)

    }

    if (maxBFactorData) {
      let values = get_values(maxBFactorData, selectedChain)
      let normalised = normalise_data(values)
      const pl = calculate_poly_line(center, 350, normalised)
      const ring = calculate_poly_line_for_circle(center, 350)
      const points = pl + ring

      setMaxBFacPoints(points)
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

  return (
    <div className='flex-col'>

      <div className='flex'>
        <div className='flex transition-al text-center align-center justify-center'>
          {chainListSet !== true ? <>Loading...</> : chainList.map((item, index) => {
            return (
              <button className='mx-2 w-16 h-16 align-middle text-center justify-center bg-secondary' key={index} onClick={() => { setSelectedChain(item) }}>
                {item}
              </button>
            )
          })}
        </div>

        <span className='text-xl text-white'>{selectedResidue}</span>
      </div>

      <svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnssvgjs="http://svgjs.dev/svgjs" width="1000" height="1000" viewBox="0 0 1000 1000" onMouseMove={(e) => { handle_mouse_move(e) }}>
        <polyline points={avgBFacPoints} fill="green" strokeWidth="0.5" stroke="blue" fillRule="evenodd" />
        <polyline points={maxBFacPoints} fill="blue" strokeWidth="0.5" stroke="red" fillRule="evenodd" />
        <polyline points={centerLinePoints} fill="gray" strokeWidth="1" stroke="gray" />

      </svg>
    </div>
  )
}

export default App
