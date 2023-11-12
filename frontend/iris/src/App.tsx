import './App.css'
import iris_module from "../api/iris.js"
import { useEffect, useState } from 'react'
import { SVG, Svg } from '@svgdotjs/svg.js'
import styles from "./index.css"

function calculate_poly_line(radius: number, data: Array<number>) {
  const header = 40
  const gap = (360 - header) / data.length

  var poly_list = ''

  for (var i = 1; i < data.length; i++) {
    let angle = (header / 2 + gap * i) * (Math.PI / 180)

    if (i == 1) {
      const x = radius * Math.sin(angle)
      const y = -radius * Math.cos(angle)
      poly_list += x
      poly_list += ","
      poly_list += y
      poly_list += " "
    }

    const x = (data[i] + radius) * Math.sin(angle)
    const y = -(data[i] + radius) * Math.cos(angle)
    poly_list += x
    poly_list += ","
    poly_list += y
    poly_list += " "

    if (i == data.length - 1) {
      const x = radius * Math.sin(angle)
      const y = -radius * Math.cos(angle)
      poly_list += x
      poly_list += ","
      poly_list += y
      poly_list += " "
    }


  }
  return poly_list
}

function calculate_poly_line_for_circle(center, radius: number) {
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

function App() {

  const [averageBFactorData, setAverageBFactorData] = useState();
  const [maxBFactorData, setMaxBFactorData] = useState();
  const [chainListSet, setChainListSet] = useState(false);
  const [chainList, setChainList] = useState(false);
  const [selectedChain, setSelectedChain] = useState();
  const [canvas, setCanvas] = useState();
  const [currentPoints, setCurrentPoints] = useState();
  const [currentPoints2, setCurrentPoints2] = useState();


  const width = window.innerWidth
  const height = window.innerHeight - 10

  useEffect(() => {

    iris_module().then((Module: any) => {
      let results = Module.test();
      console.log(results)
      let avg_b_factor_data = parse_result(results.average_b_factor);
      let max_b_factor_data = parse_result(results.max_b_factor);

      console.log(avg_b_factor_data)
      setAverageBFactorData(avg_b_factor_data)
      setMaxBFactorData(max_b_factor_data)

      var chain_list = []
      for (let i = 0; i < results.chain_labels.size(); i++) {
        chain_list.push(results.chain_labels.get(i))
      }

      setChainListSet(true)
      setChainList(chain_list)
      // let values = []
      // for (let i = 0; i < data["A"].length; i++) { 
      //   values.push(data["A"][i].val)
      // }

      // const canvas = SVG()
      // .addTo('body')
      // .size(width, height)
      // .viewbox(-width / 8, -height / 8, width / 4, height / 4)
      // generate_ring(200, values, canvas)



    })

    const canvas = SVG()
      .addTo('body')
      .size(width, height)
      .viewbox(-width / 8, -height / 8, width / 4, height / 4)
    setCanvas(canvas)

    // generate_ring(200, 10, canvas)
    // generate_ring(140, 7, canvas)
    // generate_ring(100, 7, canvas)
    // generate_ring(70, 7, canvas)
  }, [])


  useEffect(() => {
    if (averageBFactorData) { 
      let values = get_values(averageBFactorData, selectedChain)
      const pl = calculate_poly_line(50, values)
      const ring = calculate_poly_line_for_circle([0,0], 52)
      const points = pl + ring
    
      setCurrentPoints(pl)
      setCurrentPoints2(ring)
      // generate_ring(200, values, canvas);
    }

   }, [selectedChain])

  return (
    <div className='flex'>
      {chainListSet !== true ? <>Loading...</> : chainList.map((item, index) => {
        return (
          <button className='mx-2 w-8 h-8 align-middle text-center justify-center' key={index} onClick={() => {setSelectedChain(item)}}>
            {item}
          </button>
        )
      })}

  < svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnssvgjs="http://svgjs.dev/svgjs" width="964" height="1151" viewBox="-120.5 -143.875 241 287.75">
      <polyline points={currentPoints} fill="none" strokeWidth="0.5" stroke="red" fillRule="evenodd"/>
      <polyline points={currentPoints2} fill="none" strokeWidth="0.5" stroke="blue" fillRule="evenodd"/>

  </svg>

    </div>
  )
}

export default App
