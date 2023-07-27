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
    axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/history/export_pdf`, body, { responseType: 'blob' }).then((res) => {
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
      <div className="title item hover:bg-gray-100" style={{ backgroundColor: 'white', width: "100%", height: "100%", textAlign: "left", marginLeft: "100px", marginBottom: "30px" }}>


        {
          !isClicked ?
            <div className="inline-block transition-colors gap-3 rounded-md cursor-pointer hover:bg-gray-200 animate-flash" style={{ backgroundColor: "white", textAlign: "center" }}>
              <button onClick={onClickPDFExport} className="flex inline-block transition-colors  items-center gap-3 relative rounded-md cursor-pointer break-all hover:bg-gray-300 group animate-flash" style={{ width: "200px", height: "50px", textAlign: "center" }}>

                <div style={{ margin: "auto" }}>
                  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" height="2em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </div>
                <div style={{ fontFamily: "Inter", fontWeight: "700", color: "black", fontSize: "17px", marginRight: "auto" }}>PDF EXPORT</div>

              </button>
            </div> :
            <div className="inline-block transition-colors py-3 px-3 gap-3 rounded-md animate-flash" style={{ borderWidth: "1px", borderColor: "#C6CDD8", borderStyle: "solid" }}>
              <div className="flex flex-row gap-4">
                <label className="flex flex-col gap-2" style={{ fontFamily: "Noto Sans KR", fontWeight: "600", fontSize: "15px", color: "#445060" }}>
                  <input
                    type="checkbox"
                    checked={transcriptionChecked}
                    onChange={handleTranscriptionChange}
                  />
                  속기본
                </label>
                <label className="flex flex-col gap-2" style={{ fontFamily: "Noto Sans KR", fontWeight: "600", fontSize: "15px", color: "#445060" }}>
                  <input
                    type="checkbox"
                    checked={summaryChecked}
                    onChange={handleSummaryChange}
                  />
                  요약본
                </label>
                <label className="flex flex-col gap-2" style={{ fontFamily: "Noto Sans KR", fontWeight: "600", fontSize: "15px", color: "#445060" }}>
                  <input
                    type="checkbox"
                    checked={qnaChecked}
                    onChange={handleQnaChange}

                  />
                  문제
                </label>
                <div className="flex flex-row gap-1">
                  <button onClick={onClickExport} style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "15px", color: "#445060", borderWidth: "1px", borderColor: "#C6CDD8", borderStyle: "solid", borderRadius: "5px", padding: "0px 10px" }}>Export</button>
                  <button onClick={onClickX} style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "20px", marginLeft: "10px", borderWidth: "1px", borderColor: "#C6CDD8", borderStyle: "solid", borderRadius: "5px", padding: "0px 10px" }}>X</button>
                </div>
              </div> </div>}

      </div>

      <Link to="/main/record" className="item">
        <p style={{ fontFamily: "Noto Sans KR", fontWeight: "700", fontSize: "20px", width: "100%", height: "70px", borderRadius: "5px", paddingTop: "25px", textAlign: "center" }}><em>속기본</em></p></Link>
      <Link to="/main/summary" className="item">
        <p style={{ fontFamily: "Noto Sans KR", fontWeight: "700", fontSize: "20px", width: "100%", height: "70px", borderRadius: "5px", paddingTop: "25px", textAlign: "center" }}><em>요약본</em></p></Link>
      <Link to="/main/question" className="item" >
        <p style={{ fontFamily: "Noto Sans KR", fontWeight: "700", fontSize: "20px", width: "100%", height: "70px", borderRadius: "5px", paddingTop: "25px", textAlign: "center" }}><em>문제</em></p></Link>

      <div className="item" style={{ backgroundColor: '#394351', color: "black", width: "95%", height: "100%", borderRadius: "15px", boxShadow: "10px 10px 5px gray", position: "relative", verticalAlign: "center", padding: "30px 0px" }}>
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
