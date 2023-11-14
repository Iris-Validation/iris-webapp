import { Dispatch, SetStateAction } from "react"

interface ChainSelectionButtonsTypes { 
    chainList: Array<string>
    chainListSet: boolean
    selectedChain: string
    setSelectedChain: Dispatch<SetStateAction<string>>
}

export default function ChainSelectionButtons(props: ChainSelectionButtonsTypes) { 
    return (
        <div className='flex transition-al text-center align-center justify-center'>
          {props.chainListSet !== true ? <>Loading...</> : props.chainList.map((item, index) => {
            return (
              <button className={item == props.selectedChain ? 'mx-2 w-12 h-12 text-center align-middle px-1 py-1 rounded-md text-primary border-2 bg-secondary hover:bg-tertiary' : 'mx-2 w-12 h-12 rounded-md text-center align-middle px-1 py-1 border-2 text-primary bg-gray hover:bg-gray'} key={index} onClick={() => { props.setSelectedChain(item) }}>
                {item}
              </button>
            )
          })}
        </div>
    )
}