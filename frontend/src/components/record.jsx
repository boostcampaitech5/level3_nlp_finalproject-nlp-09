import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenExpiration } from "../utils/Logout";

const title = "Record";

export function Rec({ historyId }) {
  const [transcription, setTranscription] = useState(null)
  const [editing, setEditing] = useState(false);
  const updateParentSize = () => {
    const childDiv = document.getElementById('childDiv');
    if (childDiv) {
      const childHeight = childDiv.clientHeight;
      const parentDiv = document.getElementById('parentDiv');
      // parentDiv.style.height = `${0.15 * childHeight}%`;
    }
  };

  const handleEdit = () => {
    setEditing(true);
  }
  const handleSave = () => {
    setEditing(false);
    const body = {
      access_token: cookie.load('user').accessToken,
      history_id: historyId,
      transcription: transcription,
    }
    axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/history/change_transcription`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { console.log("Change Transcription Success!"); }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }
        console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
      setTranscription(transcription)
    })
  }
  const handleNoSave = () => {
    setEditing(false);
    setTranscription(transcription)
    // 여기에서 수정된 텍스트를 저장 또는 처리할 수 있습니다.
  };
  const handleChange = (event) => {
    setTranscription(event.target.value);
  };

  useEffect(() => {
    // transcription이 변경될 때마다 상위 div 크기 업데이트
    updateParentSize();
  }, [transcription, editing]);

  const navigate = useNavigate()
  const body = {
    access_token: cookie.load('user').accessToken,
    history_id: historyId
  }
  useEffect(() => {
    axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/history/transcription`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { setTranscription(result.transcription) }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }; console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
    })
  }, [historyId])

  return (
    <div id="parentDiv" className="overflow-y-scroll" style={{
      width: "95%", height: "100%", backgroundColor: 'white', margin: "auto", textAlign: "left", borderRadius: "10px", boxShadow: "5px 5px 10px", padding: "30px"
    }} >
      <p class="font-extrabold text-rec text-xl"><em>
      </em> </p>
      {transcription ? <div id="childDiv" style={{ height: "100%", backgroundColor: "white", fontFamily: "Noto Sans KR", fontWeight: "700", padding: "30px", fontSize: "18px", color: "#2D353F", lineHeight: "50px", textAlign: "justify" }}>
        {editing ? <div className="flex right-1 z-10 text-gray-300 visible" style={{ marginBottom: "30px" }}>
          <button onClick={handleSave} className="p-1 hover:text-white" style={{ marginRight: "15px" }}>
            <svg
              stroke="black"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button onClick={handleNoSave} className="p-1 hover:text-white">
            <svg
              stroke="black"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1={18} y1={6} x2={6} y2={18} />
              <line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>
        </div> : <button onClick={handleEdit} style={{ marginRight: "auto" }} className="flex transition-colors py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} hover:bg-gray-200 group animate-flash" ><div ></div><svg stroke="black" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>}
        {editing ? (<textarea
          type="text"
          value={transcription}
          onChange={handleChange}
          autoFocus
          rows="100"
          style={{ width: '100%', height: "100%", padding: "20px", textAlign: "justify" }}

        />) :
          <div>{transcription}</div>}</div> : <Spinner />
      }


    </div >
  );

}
export default Rec;