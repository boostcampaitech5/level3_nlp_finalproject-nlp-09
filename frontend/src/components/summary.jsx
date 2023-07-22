import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useState } from "react";

const title = "Summary";

export function Summ( { historyId } ) {
  const [ summary, setSummary ] = useState( null )
  const body = {
    access_token: cookie.load( 'user' ).accessToken,
    history_id: historyId
  }
  axios.post( "http://localhost:8000/history/summary", body ).then( ( res ) => {
    console.log( res.data );
    const result = res.data
    if ( result.type ) { setSummary( result.summary ) }
    else { console.log( result.message ) }

  } ).catch( error => {
    // 요청 중 에러가 발생했을 때 처리
    console.error( error );
  } )
  return (
    <div style={ {
      backgroundColor: '#FFA831', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray"
    } }>
      < div style={ {
        width: "700px", height: "800px", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      } }>

        <p class="font-extrabold text-summ text-xl"><em>{ title }</em></p>
        { summary ? summary : <Spinner /> }
      </div >
    </div >
  );

}
export default Summ;