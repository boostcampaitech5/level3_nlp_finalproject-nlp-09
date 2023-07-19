import React, { useEffect, useState } from "react";
const question = "Question";
// const answer = "naver_boost_camp_answer";


export function Ques() {
  const [qList, setQList] = useState(["problem1", "problem2", "problem3", "problem4", "problem5"]);
  const [aList, setAList] = useState(["answer1", "answer2", "answer3", "answer4", "answer5"]);
  return (
    <div style={{ backgroundColor: '#39A387', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray" }}>

      <div style={{
        width: "700px", height: "800px", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      }}>
        <p class="font-extrabold text-qa text-xl"><em>{question}</em></p>
        {/* {qList.map((question, index) => (
          <li key={index}>{question}</li>
        ))} */}
      </div>
    </div >
  );

}
export default Ques;