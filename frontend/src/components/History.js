import { useState, useEffect } from "react"
import PropTypes from "prop-types";
import axios from "axios";
import cookie from 'react-cookies'
import Del from "./Del"

const History = ( { isActive, id, history, onClickHistory } ) => {
  const [ del, setDel ] = useState( false );

  const accessToken = cookie.load( 'user' ).accessToken
  const historyID = id
  const onClick = () => {
    console.log( "Clicked" );
    console.log( id );
    onClickHistory( historyID )
    console.log( "historyID", historyID )
  }
  const onClickDel = () => {
    console.log( "DEL" )
    const body = {
      access_token: accessToken,
      history_id: historyID
    }
    axios.post( "http://localhost:8000/history/delete", body ).then( ( res ) => {
      console.log( res.data );
      const result = res.data
      if ( result.type ) { console.log( "Delete Success!" ); setDel( true ); }
      else {
        console.log( result.message )
      }

    } ).catch( error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error( error );
    } )

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
              { history }
            </div>

          </button>

          { isActive ? (
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
            : null
          }

        </div > ) }
    </div>
  )

}

History.propTypes = {
  id: PropTypes.number.isRequired,
  history: PropTypes.string.isRequired
}

export default History