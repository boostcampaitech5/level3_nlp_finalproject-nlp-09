import { useState } from "react"
import Del from "./Del"

const History = () => {
  const [ isClicked, setIsClicked ] = useState( false )
  const [ del, setDel ] = useState( false )
  const onClick = () => {
    console.log( "Clicked" )
    setIsClicked( ( bool ) => ( !bool ) )
  }
  const onClickDel = () => {
    console.log( "DEL" )
    setDel( true );
  }

  return (
    <div>
      { del ? null : (
        <div style={ { margin: "10px 0", display: "flex" }
        } >
          <button onClick={ onClick } className="flex w-full transition-colors py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} hover:bg-gray-800 group animate-flash">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={ 2 }
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
              React 컴포넌트 이름 규칙이야아하하하하하하하하하하
            </div>

          </button>

          { isClicked ? null : (
            <button onClick={ onClickDel } className="p-1 hover:text-white">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={ 2 }
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1={ 10 } y1={ 11 } x2={ 10 } y2={ 17 } />
                <line x1={ 14 } y1={ 11 } x2={ 14 } y2={ 17 } />
              </svg>
            </button>
          )
          }

        </div > ) }
    </div>
  )

}

export default History