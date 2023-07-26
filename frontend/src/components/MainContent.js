import "./route.css"
import Ques from "./question";
import Rec from "./record";
import Summ from "./summary";
import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { tokenExpiration } from "../utils/Logout";
import axios from "axios";
import cookie from 'react-cookies'
import { getCurrentTimeFormatted } from "../utils/Time";


function MainContent( { selectedId } ) {
  const [ transcriptionChecked, setTranscriptionChecked ] = useState( false );
  const [ summaryChecked, setSummaryChecked ] = useState( false );
  const [ qnaChecked, setQnaChecked ] = useState( false );
  const [ isClicked, setIsClikced ] = useState( false );
  useEffect( () => {
    setIsClikced( false );
  }, [ selectedId ] )
  const navigate = useNavigate()
  const onClickPDFExport = () => {
    setIsClikced( ( bool ) => !bool )
  }
  const handleTranscriptionChange = () => {
    setTranscriptionChecked( !transcriptionChecked );
  };

  const handleSummaryChange = () => {
    setSummaryChecked( !summaryChecked );
  };

  const handleQnaChange = () => {
    setQnaChecked( !qnaChecked );
  };

  const getFilenameFromContentDisposition = ( response ) => {
    const contentDisposition = response.headers[ "content-disposition" ];
    const match = contentDisposition && contentDisposition.match( /filename = "(.*?)" / );
    return match && match[ 1 ] ? match[ 1 ] : "file.pdf"; // Default filename if not found
  };

  const onClickExport = () => {
    const body = {
      access_token: cookie.load( 'user' ).accessToken,
      history_id: selectedId,
      ex_trans: transcriptionChecked,
      ex_summ: summaryChecked,
      ex_qna: qnaChecked,
    }
    console.log( body )
    axios.post( `http://${process.env.REACT_APP_SERVER_URL}/history/export_pdf`, body, { responseType: 'blob' } ).then( ( res ) => {
      console.log( res.data );

      const filename = getFilenameFromContentDisposition( res );
      const currentTime = getCurrentTimeFormatted();
      const url = URL.createObjectURL( res.data );
      const link = document.createElement( "a" );

      link.href = url;
      link.download = `LecnRec_${currentTime}.pdf`;
      link.click();

      URL.revokeObjectURL( url );

      const result = res.data

      if ( result.type ) { console.log( "Get Link Complete!" ); }
      else {
        if ( tokenExpiration( result.message ) ) {
          navigate( '/' )
        }
        console.log( result.message )
      }

    } ).catch( error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error( error );
    } )

  }
  const onClickX = () => {
    setIsClikced( ( bool ) => !bool )
  }
  return (
    <div className="container overflow-y-scroll " >
      <div className="title" style={ { backgroundColor: 'white', width: "100%", height: "100%", textAlign: "left", paddingLeft: "45px", paddingTop: "50px" } }>

        <div class="font-extrabold text-primary_120 text-xxl">
          <em style={ { color: "#25A2C3" } }>Lec </em>
          <em style={ { color: "#333333" } }>&</em>
          <em style={ { color: "#F6755E" } } > Rec</em>
        </div>

        {
          !isClicked ?
            <div className="inline-block transition-colors py-3 px-3 gap-3 rounded-md cursor-pointer hover:bg-gray-200 border animate-flash">
              <button onClick={ onClickPDFExport } className="flex inline-block transition-colors  items-center gap-3 relative rounded-md cursor-pointer break-all hover:bg-gray-200 group animate-flash">

                <div>
                  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </div>
                <div>PDF EXPORT</div>

              </button>
            </div> :
            <div className="inline-block transition-colors py-3 px-3 gap-3 rounded-md border animate-flash">
              <div className="flex flex-row gap-4">
                <label className="flex flex-col gap-2">
                  <input
                    type="checkbox"
                    checked={ summaryChecked }
                    onChange={ handleSummaryChange }
                  />
                  속기본
                </label>
                <label className="flex flex-col gap-2">
                  <input
                    type="checkbox"
                    checked={ transcriptionChecked }
                    onChange={ handleTranscriptionChange }
                  />
                  요약본
                </label>
                <label className="flex flex-col gap-2">
                  <input
                    type="checkbox"
                    checked={ qnaChecked }
                    onChange={ handleQnaChange }
                  />
                  문제
                </label>
                <div className="flex flex-row gap-1">
                  <button onClick={ onClickExport } className="inline-block transition-colors py-3 px-3 gap-3 rounded-md border animate-flash hover:bg-gray-200">Export</button>
                  <button onClick={ onClickX } className="inline-block transition-colors py-3 px-4 gap-3 rounded-md border animate-flash hover:bg-gray-200">X</button>
                </div>
              </div> </div> }

      </div>

      <Link to="/main/record" style={ { width: "95%", height: "70px", backgroundColor: '#F6755E', boxShadow: "5px 5px 10px white", borderRadius: "5px", clipPath: "polygon(36% 0, 100% 0, 100% 100%, 0% 100%)", marginTop: "84px", paddingTop: "25px", paddingLeft: "35px", justifySelf: "center" } }>
        <p class="font-extrabold text-white text-lg"><em>속기본</em></p></Link>
      <Link to="/main/summary" style={ { backgroundColor: '#FFA831', width: "95%", height: "70px", boxShadow: "5px 5px 10px white", borderRadius: "5px", clipPath: "polygon(36% 0, 100% 0, 100% 100%, 0% 100%)", marginTop: "84px", paddingTop: "25px", paddingLeft: "35px" } }>
        <p class="font-extrabold text-white text-lg"><em>요약본</em></p></Link>
      <Link to="/main/question" style={ { backgroundColor: '#39A387', width: "95%", height: "70px", boxShadow: "5px 5px 10px white", borderRadius: "5px", clipPath: "polygon(36% 0, 100% 0, 100% 100%, 0% 100%)", marginTop: "84px", paddingTop: "25px", paddingLeft: "40px" } }>
        <p class="font-extrabold text-white text-lg"><em>문제</em></p></Link>
      <div className="item" style={ { backgroundColor: 'white', color: "black", width: "95%", height: "100%", paddingBottom: "30px" } }>
        <Routes>
          <Route path="/" element={ <Rec historyId={ selectedId } /> } />
          <Route path="/record" element={ <Rec historyId={ selectedId } /> } />
          <Route path="/summary" element={ <Summ historyId={ selectedId } /> } />
          <Route path="/question" element={ <Ques historyId={ selectedId } /> } />
        </Routes>
      </div>

    </div >
  );

}
export default MainContent;
