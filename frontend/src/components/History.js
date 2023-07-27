import { useState } from "react"
import PropTypes from "prop-types";
import axios from "axios";
import cookie from 'react-cookies'
import { tokenExpiration } from "../utils/Logout";
import { useNavigate } from "react-router-dom";

const History = ({ isActive, id, history, onClickHistory }) => {
  const [editing, setEditing] = useState(false);
  const [historyTitle, setHistoryTitle] = useState(history)

  const navigate = useNavigate()
  const accessToken = cookie.load('user').accessToken
  const historyID = id

  const handleEdit = () => {
    setEditing(true);
  }
  const handleSave = () => {
    setEditing(false);
    const body = {
      access_token: accessToken,
      history_id: historyID,
      title: historyTitle,
    }
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/change_title`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { console.log("Change Title Success!"); onClickHistory(historyID); }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }
        console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
      setHistoryTitle(history)
    })
  }
  const handleNoSave = () => {
    setEditing(false);
    setHistoryTitle(history)
    // 여기에서 수정된 텍스트를 저장 또는 처리할 수 있습니다.
  };

  const handleChange = (event) => {
    setHistoryTitle(event.target.value);
  };

  const onClick = () => {
    console.log("Clicked");
    console.log(id);
    onClickHistory(historyID)
    console.log("historyID", historyID)
  }
  const onClickDel = () => {
    console.log("DEL")
    const body = {
      access_token: accessToken,
      history_id: historyID
    }
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/delete`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { console.log("Delete Success!"); onClickHistory(null); }
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

  return (
    <div>
      {(
        <div style={{ borderStyle: "solid", borderWidth: "0px 0px 1px 0px", borderColor: "white" }}>
          <button onClick={onClick} className="flex w-full transition-colors py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} hover:bg-gray-800 group animate-flash">

            <div >
              {editing ? (
                <div className="flex flex-row gap-5">
                  <input
                    type="text"
                    value={historyTitle}
                    onChange={handleChange}

                    autoFocus
                    className="bg-black border-none"
                    style={{ width: "120px" }}
                  />
                  <div className="flex right-1 z-10 text-gray-300 visible">
                    <button onClick={handleSave} className="p-1 hover:text-white">
                      <svg
                        stroke="white"
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
                        stroke="white"
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
                  </div>
                </div>
              ) : (
                <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                  {historyTitle}
                </div>
              )
              }</div>
            <div style={{ marginLeft: "auto" }}>          {
              (isActive && !editing) ? (
                <div class="flex right-1 z-10 text-gray-300 visible">
                  <button onClick={handleEdit} class="p-1 hover:text-white" ><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                  <button onClick={onClickDel} className="p-1 hover:text-white" >
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
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1={10} y1={11} x2={10} y2={17} />
                      <line x1={14} y1={11} x2={14} y2={17} />
                    </svg>
                  </button>
                </div>)
                : null
            }</div>
          </button>



        </div >)}
    </div >
  )

}

History.propTypes = {
  id: PropTypes.number.isRequired,
  history: PropTypes.string.isRequired
}

export default History