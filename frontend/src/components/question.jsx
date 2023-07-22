import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useEffect, useState } from "react";

const title = "Question";
// const answer = "naver_boost_camp_answer";


export function Ques( { historyId } ) {
  const [ qnaList, setQNAList ] = useState( null );

  const body = {
    access_token: cookie.load( 'user' ).accessToken,
    history_id: historyId
  }
  useEffect( () => {
    axios.post( "http://localhost:8000/history/qna", body ).then( ( res ) => {
      console.log( res.data );
      const result = res.data
      if ( result.type ) { setQNAList( result.qnas ) }
      else { console.log( result.message ) }

    } ).catch( error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error( error );
    } )
  }, [] )
  return (
    <div style={ { backgroundColor: '#39A387', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray" } }>

      <div style={ {
        width: "700px", height: "800px", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      } }>

        <p class="font-extrabold text-qa text-xl"><em>{ title }</em></p>
        { qnaList ? qnaList.map( ( qna ) => (
          <ol key={ qna.qna_id }>
            <li>  { qna.question }</li>
            <li>  { qna.answer }</li>
          </ol>

        ) ) : <Spinner /> }
      </div>
    </div >
  );

}
export default Ques;