import Spinner from "./Spinner";
import axios from "axios";
import cookie from 'react-cookies'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenExpiration } from "../utils/Logout";

const title = "Question";
const RETRY_DELAY_MS = 2000; // 2초 간격으로 재시도

export function Ques({ historyId }) {
  const [qnaList, setQNAList] = useState(null);
  const [updatedQNAList, setUpdatedQNAList] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  let timerId;

  const updateParentSize = () => {
    const childDiv = document.getElementById('childDiv');
    if (childDiv) {
      const childHeight = childDiv.clientHeight;
      const parentDiv = document.getElementById('parentDiv');
      // parentDiv.style.height = `${0.30 * childHeight}%`;
    }
  };
  const handleEdit = (qnaId) => {
    setUpdatedQNAList(qnaList);
    setEditingItemId(qnaId);

  }
  const handleChange = (event, qnaId, field) => {
    // Handle the input change and update the corresponding qna item in the state
    const newUpdatedQNAList = qnaList.map((qna) =>
      qna.qna_id === qnaId
        ? { ...qna, [field]: event.target.value }
        : qna
    );
    setUpdatedQNAList(newUpdatedQNAList);
  };
  const handleSave = (qnaId, index) => {
    setEditingItemId(null);
    const body = {
      access_token: cookie.load('user').accessToken,
      history_id: historyId,
      qna_id: qnaId,
      question: updatedQNAList[index].question,
      answer: updatedQNAList[index].answer,
    }

    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/change_qna`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { console.log("Change QNA Success!"); setQNAList(updatedQNAList); }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }
        console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
      setUpdatedQNAList(qnaList)
    })
  }
  const handleNoSave = () => {
    setEditingItemId(null)
    setUpdatedQNAList(qnaList)
  }
  const onClickDel = (qnaId) => {
    const body = {
      access_token: cookie.load('user').accessToken,
      qna_id: qnaId,
    }
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/delete_qna`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) {
        console.log("Delete QNA Success!"); setQNAList(updatedQNAList);
        const filteredQnaList = qnaList.filter((qna) => qna.qna_id !== qnaId);
        setQNAList(filteredQnaList);
        setUpdatedQNAList(filteredQnaList);
      }
      else {
        if (tokenExpiration(result.message)) {
          navigate('/')
        }
        console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
      setUpdatedQNAList(qnaList)
    })

  }
  useEffect(() => {
    // transcription이 변경될 때마다 상위 div 크기 업데이트
    updateParentSize();
  }, [qnaList]);
  const navigate = useNavigate()
  const fetchData = () => {
    const body = {
      access_token: cookie.load('user').accessToken,
      history_id: historyId
    }
    setQNAList(null);
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/history/qna`, body).then((res) => {
      console.log(res.data);
      const result = res.data
      if (result.type) { setQNAList(result.qnas); setUpdatedQNAList(result.qnas) }
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

      <div id="parentDiv" style={{
        width: "90%", backgroundColor: 'white', margin: "0 auto", textAlign: "center", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      }}>

        <p class="font-extrabold text-qa text-xl"><em></em></p>

        {qnaList ?
          <div id="childDiv">
            {updatedQNAList.map((qna, index) => (
              <div key={qna.qna_id}>
                {editingItemId === qna.qna_id ?
                  (
                    <div className="px-4">
                      <div className="flex flex-row gap-2">
                        <div>Q.</div>
                        <textarea
                          value={qna.question}
                          onChange={(event) => handleChange(event, qna.qna_id, 'question')}
                          autoFocus
                          rows="2"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="flex flex-row gap-2">
                        <div>A.</div>
                        <textarea
                          value={qna.answer}
                          onChange={(event) => handleChange(event, qna.qna_id, 'answer')}
                          rows="2"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="flex right-1 z-10 text-gray-400 visible">
                        <button onClick={() => handleSave(qna.qna_id, index)} className="p-1 hover:text-white">
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
                        <button onClick={handleNoSave} className="p-1 hover:text-white">
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
                      </div>
                    </div>

                  ) : (
                    <ol key={qna.qna_id} className="flex flex-col w-full transition-colors py-3 px-4 items-left text-left gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} group animate-flash" key={qna.qna_id}>
                      <li className="font-bold"> Q. {qna.question}</li>
                      <li className="font-bold" style={{ color: "blue" }}> A. {qna.answer}</li>
                      <div class="flex right-1 z-10 text-gray-400 visible">
                        <button onClick={() => handleEdit(qna.qna_id)} class="p-1 hover:bg-gray-200"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                        <button onClick={() => onClickDel(qna.qna_id)} className="p-1 hover:bg-gray-200">
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
                      </div>
                      <div className="bg-gray-700" style={{ width: "100%", height: "3px" }} />
                    </ol>)}

              </div>
            ))}</div>
          : <Spinner />}

      </div>
    </div >
  );

}
export default Ques;