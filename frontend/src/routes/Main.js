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
  const [ isContent, setisContent ] = useState( false );
  const [ selectedId, setSelectedId ] = useState( null );

  const userNameCookie = cookie.load( 'user' ).userName
  const accessToken = cookie.load( 'user' ).accessToken
  const uploadState = useLocation().state
  const onClickNote = () => {
    setisContent( false );
    setSelectedId( null );
  }
  const handleClickHistory = ( id ) => {
    setSelectedId( id );
    setisContent( false );
  };
  const body = {
    access_token: accessToken
  }

  console.log( userNameCookie )
  console.log( accessToken )
  console.log( "----------" )
  console.log( "uploadState", uploadState )
  useEffect( () => { if ( uploadState ) { setisContent( uploadState ) } }, [ uploadState ] )
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
            console.log( result.message )
          }
        }
      } ).catch( error => {
        // 요청 중 에러가 발생했을 때 처리
        console.error( error );
      } )
    }, [] )



  return (

    <div className="overflow-hidden w-full h-full relative flex z-0" style={ { width: "100vw", height: "100vh" } }>

      <Sidebar selectedId={ selectedId } onClickHistory={ handleClickHistory } onClickNote={ onClickNote } historyList={ histories } />
      { ( isContent || selectedId ) ? <MainContent selectedId={ selectedId } /> : <MainLayout /> }
      {/* <MainContent /> */ }
    </div >

  )
}

export default Main