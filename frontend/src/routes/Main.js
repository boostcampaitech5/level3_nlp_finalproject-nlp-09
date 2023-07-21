import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import cookie from 'react-cookies'
import axios from "axios";
import Sidebar from "../components/Sidebar";
import MainLayout from "../components/MainLayout"
import MainContent from "../components/MainContent";

function Main() {
  const [ result, setResult ] = useState( null );
  const [ histories, setHistories ] = useState( null );
  const [ isUpload, setIsUpload ] = useState( false );

  const userNameCookie = cookie.load( 'user' ).userName
  const accessToken = cookie.load( 'user' ).accessToken
  const uploadState = useLocation().state

  const body = {
    access_token: accessToken
  }

  console.log( userNameCookie )
  console.log( accessToken )
  console.log( "----------" )
  console.log( "uploadState", uploadState )
  useEffect( () => { if ( uploadState ) { setIsUpload( uploadState ) } }, [ uploadState ] )
  useEffect( () => {
    axios.post( "http://localhost:8000/history", body ).then( ( res ) => {
      console.log( res.data )
      setResult( res.data )
    } ).catch( error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error( error );
    } )
  }, [] );
  useEffect( () => {
    if ( result ) {
      if ( result.type ) {
        setHistories( result.history_list )
      }
      else {
        console.log( result.message )
      }
    }
  }, [ result ] )

  return (

    <div className="overflow-hidden w-full h-full relative flex z-0" style={ { width: "100vw", height: "100vh" } }>

      <Sidebar historyList={ histories } />
      { isUpload ? <MainContent /> : <MainLayout /> }
    </div >

  )
}

export default Main