import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenExpiration } from "../utils/Logout";

const title = "Summary";
const RETRY_DELAY_MS = 2000; // 2초 간격으로 재시도

export function Summ( { historyId } ) {
  const [ summaryList, setSummaryList ] = useState( null )
  const navigate = useNavigate();
  const updateParentSize = () => {
    const childDiv = document.getElementById( 'childDiv' );
    if ( childDiv ) {
      const childHeight = childDiv.clientHeight;
      const parentDiv = document.getElementById( 'parentDiv' );
      parentDiv.style.height = `${0.30 * childHeight}%`;
    }
  };
  useEffect( () => {
    // transcription이 변경될 때마다 상위 div 크기 업데이트
    updateParentSize();
  }, [ summaryList ] );
  const fetchData = () => {
    const body = {
      access_token: cookie.load( 'user' ).accessToken,
      history_id: historyId
    }
    setSummaryList( null )
    axios.post( "http://localhost:8000/history/summary", body ).then( ( res ) => {
      console.log( res.data );
      const result = res.data
      if ( result.type ) { setSummaryList( result.summary ) }
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
  useEffect( () => { fetchData() }, [ historyId ] )

  return (
    <div id="parentDiv" style={ {
      backgroundColor: '#FFA831', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray"
    } }>
      < div id="parentDiv" style={ {
        width: "90%", height: "80%", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      } }>

        <p class="font-extrabold text-summ text-xl"><em></em></p>
        { summaryList ? <div id="childDiv" className="flex flex-col w-full transition-colors py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} hover:bg-gray-200 border group animate-flash">
          <div className="text-left">{ summaryList.map( ( summary ) => ( <li >{ summary }</li> ) ) }</div>
        </div> : <Spinner /> }
      </div >
    </div >
  );

}
export default Summ;