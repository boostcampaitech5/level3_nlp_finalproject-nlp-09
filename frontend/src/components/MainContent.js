import "./route.css"
import Ques from "./question";
import Rec from "./record";
import Summ from "./summary";
import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';


function MainContent( { selectedId } ) {
  return (
    <div className="container overflow-y-scroll " >
      <div className="title" style={ { backgroundColor: 'white', width: "100%", height: "100%", textAlign: "left", paddingLeft: "45px", paddingTop: "50px" } }>
        <div class="font-extrabold text-primary_120 text-xxl">
          <em style={ { color: "#25A2C3" } }>Lec </em>
          <em style={ { color: "#333333" } }>&</em>
          <em style={ { color: "#F6755E" } } > Rec</em>
        </div>
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