import { Dispatch, SetStateAction } from "react"

interface ChainSelectionButtonsTypes { 
    chainList: Array<string>
    chainListSet: boolean
    setSelectedChain: Dispatch<SetStateAction<string>>
}

export default function ChainSelectionButtons(props: ChainSelectionButtonsTypes) { 
    return (
        <div className='flex transition-al text-center align-center justify-center'>
          {props.chainListSet !== true ? <>Loading...</> : props.chainList.map((item, index) => {
            return (
              <button className='mx-2 w-16 h-16 align-middle text-center justify-center bg-secondary' key={index} onClick={() => { props.setSelectedChain(item) }}>
                {item}
              </button>
            )
          })}
        </div>
    )
}