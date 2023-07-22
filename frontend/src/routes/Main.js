import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cookie from 'react-cookies'
import axios from "axios";
import Sidebar from "../components/Sidebar";
import MainLayout from "../components/MainLayout"
import MainContent from "../components/MainContent";
import { tokenExpiration } from "../utils/Logout";

function Main() {
  const [ histories, setHistories ] = useState( null );
  const [ selectedId, setSelectedId ] = useState( null );
  const navigate = useNavigate()
  const userNameCookie = cookie.load( 'user' ).userName
  const accessToken = cookie.load( 'user' ).accessToken
  const uploadState = useLocation().state
  const onClickNote = () => {
    setSelectedId( null );
  }
  const handleClickHistory = ( id ) => {
    setSelectedId( id );

  };
  const handleUpload = ( id ) => {
    setSelectedId( id )
  }
  const body = {
    access_token: accessToken
  }

  console.log( userNameCookie )
  console.log( accessToken )
  console.log( "----------" )
  console.log( "uploadState", uploadState )

  useEffect
    ( () => {
      axios.post( "http://localhost:8000/history", body ).then( ( res ) => {
        console.log( res.data )
        const result = res.data
        // setResult( res.data )
        if ( result ) {
          if ( result.type ) {
            setHistories( result.history_list )
          }
          else {
            if ( tokenExpiration( result.message ) ) {
              console.log( "!!!!" )
            }
            navigate( '/' )
            console.log( result.message )
          }
        }
      } ).catch( error => {
        // 요청 중 에러가 발생했을 때 처리
        console.error( error );
      } )
    }, [ selectedId ] )



  return (

    <div className="overflow-hidden w-full h-full relative flex z-0" style={ { width: "100vw", height: "100vh" } }>

      <Sidebar selectedId={ selectedId } onClickHistory={ handleClickHistory } onClickNote={ onClickNote } historyList={ histories } />
      { ( selectedId ) ? <MainContent selectedId={ selectedId } /> : <MainLayout onUpload={ handleUpload } /> }
    </div >

  )
}

export default Main