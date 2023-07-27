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


function MainContent({ selectedId }) {
  const [transcriptionChecked, setTranscriptionChecked] = useState(false);
  const [summaryChecked, setSummaryChecked] = useState(false);
  const [qnaChecked, setQnaChecked] = useState(false);
  const [isClicked, setIsClikced] = useState(false);
  useEffect(() => {
    setIsClikced(false);
  }, [selectedId])
  const navigate = useNavigate()
  const onClickPDFExport = () => {
    setIsClikced((bool) => !bool)
  }
  const handleTranscriptionChange = () => {
    setTranscriptionChecked(!transcriptionChecked);
  };

  const handleSummaryChange = () => {
    setSummaryChecked(!summaryChecked);
  };

  const handleQnaChange = () => {
    setQnaChecked(!qnaChecked);
  };

  const getFilenameFromContentDisposition = (response) => {
    const contentDisposition = response.headers["content-disposition"];
    const match = contentDisposition && contentDisposition.match(/filename = "(.*?)" /);
    return match && match[1] ? match[1] : "file.pdf"; // Default filename if not found
  };

  const onClickExport = () => {
    const body = {
      access_token: cookie.load('user').accessToken,
      history_id: selectedId,
      ex_trans: transcriptionChecked,
      ex_summ: summaryChecked,
      ex_qna: qnaChecked,
    }
    console.log(body)
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/export_pdf`, body, { responseType: 'blob' }).then((res) => {
      console.log(res.data);

      const filename = getFilenameFromContentDisposition(res);
      const currentTime = getCurrentTimeFormatted();
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = `LecnRec_${currentTime}.pdf`;
      link.click();

      URL.revokeObjectURL(url);

      const result = res.data

      if (result.type) { console.log("Get Link Complete!"); }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }
        console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
    })

  }
  const onClickX = () => {
    setIsClikced((bool) => !bool)
  }
  return (
    <div className="container overflow-y-scroll " >
      <div className="title" style={{ backgroundColor: 'white', width: "100%", height: "100%", textAlign: "left", paddingLeft: "45px", paddingTop: "50px" }}>

        <div class="font-extrabold text-primary_120 text-xxl" style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "30px" }}>
          History Name
        </div>
      </div>

      <Link to="/main/record" className="item">
        <p style={{ fontFamily: "Noto Sans KR", fontWeight: "900", fontSize: "18px" }}><em>속기본</em></p></Link>
      <Link to="/main/summary" className="item">
        <p style={{ fontFamily: "Noto Sans KR", fontWeight: "900", fontSize: "18px" }}><em>요약본</em></p></Link>
      <Link to="/main/question" className="item">
        <p style={{ fontFamily: "Noto Sans KR", fontWeight: "900", fontSize: "18px" }}><em>문제</em></p></Link>

      <div className="item" style={{ backgroundColor: '#5F5F5F', color: "black", width: "95%", height: "100%", borderRadius: "15px", boxShadow: "10px 10px 5px gray", position: "relative", padding: "30px" }}>
        <Routes>
          <Route path="/" element={<Rec historyId={selectedId} />} />
          <Route path="/record" element={<Rec historyId={selectedId} />} />
          <Route path="/summary" element={<Summ historyId={selectedId} />} />
          <Route path="/question" element={<Ques historyId={selectedId} />} />
        </Routes>
      </div>

    </div >
  );

}
export default MainContent;
