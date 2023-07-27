import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenExpiration } from "../utils/Logout";

const title = "Summary";
const RETRY_DELAY_MS = 2000; // 2초 간격으로 재시도

export function Summ({ historyId }) {
  const [summaryList, setSummaryList] = useState(null)
  const [updatedSummaryList, setUpdatedSummaryList] = useState(null);
  const [editing, setEditing] = useState(false);

  let timerId;
  const navigate = useNavigate();
  const updateParentSize = () => {
    const childDiv = document.getElementById('childDiv');
    if (childDiv) {
      const childHeight = childDiv.clientHeight;
      const parentDiv = document.getElementById('parentDiv');
      // parentDiv.style.height = `${0.30 * childHeight}%`;
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
      summary: updatedSummaryList.join('\n'),
    }
    console.log("UPDATED", updatedSummaryList)
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/change_summary`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { console.log("Change Summary Success!"); setSummaryList(updatedSummaryList) }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }
        console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
      setUpdatedSummaryList(summaryList)
    })
  }
  const handleNoSave = () => {
    setEditing(false);
    setUpdatedSummaryList(summaryList)
    // 여기에서 수정된 텍스트를 저장 또는 처리할 수 있습니다.
  };
  const handleChange = (event, index) => {
    const newUpdatedSummaryList = [...summaryList]
    newUpdatedSummaryList[index] = event.target.value;
    setUpdatedSummaryList(newUpdatedSummaryList)
  };

  useEffect(() => {
    updateParentSize();
  }, [summaryList]);
  const fetchData = () => {
    const body = {
      access_token: cookie.load('user').accessToken,
      history_id: historyId
    }
    setSummaryList(null);
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/summary`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { setSummaryList(result.summary); setUpdatedSummaryList(result.summary) }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }; console.log(result.message); timerId = setTimeout(fetchData, RETRY_DELAY_MS)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
    })
  }
  useEffect(() => {
    fetchData();
    return () => {
      clearTimeout(timerId);
    };
  }, [historyId])

  return (
    <div className="bg-gray-700" id="parentDiv" style={{
      color: "black", width: "100%", position: "relative", paddingTop: "10px", paddingBottom: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray"
    }}>
      < div id="parentDiv" style={{
        width: "90%", backgroundColor: 'white', margin: "0 auto", textAlign: "justify", paddingTop: "15px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      }}>

        <p class="font-extrabold text-summ text-xl"><em></em></p>
        {summaryList ?
          <div>
            {editing ? <div className="flex justify-center right-1 z-10 text-gray-400 visible p-4">
              <button onClick={handleSave} className="p-1 hover:bg-gray-200">
                <svg
                  stroke="currentColor"
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
              <button onClick={handleNoSave} className="p-1 hover:bg-gray-200">
                <svg
                  stroke="currentColor"
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
            </div> : <div className="flex justify-center"><button onClick={handleEdit} className="flex transition-colors py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} hover:bg-gray-200 group animate-flash"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button></div>}

            {editing ? (
              <div>
                {
                  updatedSummaryList.map((summary, index) =>
                  (<textarea
                    key={index}
                    type="text"
                    value={summary}
                    onChange={(event) => handleChange(event, index)}
                    autoFocus
                    rows="3"
                    style={{ width: '100%', paddingLeft: "20px", paddingRight: "20px" }}

                  />
                  ))}
              </div>) :
              <div id="childDiv" className="flex flex-col w-full transition-colors py-3 px-4 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} hover:bg-gray-200 group animate-flash">
                <ul className="text-left">{summaryList.map((summary) => (<li >- {summary}<br /><br /></li>))}</ul>
              </div>}
          </div> : <Spinner />}
      </div >
    </div >
  );

}
export default Summ;