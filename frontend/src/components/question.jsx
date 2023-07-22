import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenExpiration } from "../utils/Logout";

const title = "Question";
const RETRY_DELAY_MS = 2000; // 2초 간격으로 재시도


export function Ques( { historyId } ) {
  const [ qnaList, setQNAList ] = useState( null );
  const navigate = useNavigate()
  const fetchData = () => {
    const body = {
      access_token: cookie.load( 'user' ).accessToken,
      history_id: historyId
    }
    setQNAList( null )
    axios.post( "http://localhost:8000/history/qna", body ).then( ( res ) => {
      console.log( res.data );
      const result = res.data
      if ( result.type ) { setQNAList( result.qnas ) }
      else {
        if ( tokenExpiration( result.message ) ) {
          navigate( '/' )
        }; console.log( result.message ); setTimeout( fetchData, RETRY_DELAY_MS )
      }

    } ).catch( error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error( error );
    } )
  }
  useEffect( () => {
    fetchData();
  }, [ historyId ] )
  return (
    <div style={ { backgroundColor: '#39A387', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray" } }>

      <div style={ {
        width: "700px", height: "800px", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      } }>

        <p class="font-extrabold text-qa text-xl"><em></em></p>
        { qnaList ? qnaList.map( ( qna ) => (
          <ol className="flex flex-col w-full transition-colors py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} hover:bg-gray-200 border group animate-flash" key={ qna.qna_id }>
            <li> Q. { qna.question }</li>
            <li> A. { qna.answer }</li>
            <div class="flex right-1 z-10 text-gray-300 visible">
              <button class="p-1 hover:text-white"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
              <button className="p-1 hover:text-white">
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
            </div>
          </ol>

        ) ) : <Spinner /> }
      </div>
    </div >
  );

}
export default Ques;