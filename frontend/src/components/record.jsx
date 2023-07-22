import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenExpiration } from "../utils/Logout";

const title = "Record";

export function Rec( { historyId } ) {
  const [ transcription, setTranscription ] = useState( null )
  const navigate = useNavigate()
  const body = {
    access_token: cookie.load( 'user' ).accessToken,
    history_id: historyId
  }
  useEffect( () => {
    axios.post( "http://localhost:8000/history/transcription", body ).then( ( res ) => {
      console.log( res.data );
      const result = res.data
      if ( result.type ) { setTranscription( result.transcription ) }
      else {
        if ( tokenExpiration( result.message ) ) {
          navigate( '/' )
        }; console.log( result.message )
      }

    } ).catch( error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error( error );
    } )
  }, [ historyId ] )

  return (
    <div style={ { backgroundColor: '#F6755E', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray", } } >
      <div style={ {
        width: "700px", height: "800px", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      } }>
        <p class="font-extrabold text-rec text-xl"><em>
          { title }</em> </p>
        { transcription ? transcription : <Spinner /> }
      </div>

    </div >
  );

}
export default Rec;