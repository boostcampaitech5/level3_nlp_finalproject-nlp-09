import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cookie from 'react-cookies'
import PropTypes from "prop-types";
import Logout from "./Logout";
import History from "./History";
import logo from "./LecNRecIcon.png"
import person from './person.svg'

const Sidebar = ({ selectedId, historyList, onClickNote, onClickHistory }) => {
  console.log("IM historylist", historyList)
  const [isButtonHidden, setIsButtonHidden] = useState(true);
  const [isSetting, setIsSetting] = useState(false);
  const [userName, setUserName] = useState("")
  const [histories, setHistories] = useState(null);
  const navigate = useNavigate()
  useEffect
    (() => {
      setUserName(cookie.load('user').userName)
      setHistories(historyList)
    }, [userName, historyList])

  const onClickSetting = () => {
    setIsSetting((bool) => !bool)
  }
  const onClickBar = () => {
    setIsButtonHidden((bool) => !bool)
  }
  const onClickNewNote = () => {
    navigate('/main')
    onClickNote();
  }
  const handleClickHistory = (id) => {
    onClickHistory(id);
  }
  return (
    <>
      {isButtonHidden ? null : <button onClick={onClickBar} style={{ position: "relative", top: "8px", left: "8px" }} aria-label="Show sidebar" className="flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border bg-white dark:bg-gray-800 border-black/10 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-gray-700 h-11"><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-black dark:text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></button>}
      < div
        className="dark flex-shrink-0 overflow-x-hidden bg-gray-900"
        style={{ visibility: isButtonHidden ? "visible" : "hidden", width: isButtonHidden ? 260 : 0, }
        }
      >

        <div className="h-full w-[260px]">
          <div className="flex h-full min-h-0 flex-col ">
            <div className="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20">

              <nav
                className="flex h-full w-full flex-col p-2" style={{ backgroundColor: "#313A46" }}
              >
                <div className="text-white h2 m-auto" style={{ fontWeight: "800", paddingTop: "15px", paddingBottom: "15px", fontFamily: "Inter", display: "flex", fontSize: "25px" }}>
                  <img src={logo} style={{ width: "30px", marginRight: "10px" }} />Lec & Rec
                </div>
                <div className="mb-1 flex flex-row gap-3">


                </div>

                <div className="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
                  <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
                    <div>
                      <span>
                        <div>
                          <h4 className="h4" style={{ color: "#939393", fontFamily: "Inter", fontWeight: "700", paddingLeft: "5px", float: "left" }}>
                            History
                          </h4>
                          <span className="flex" data-state="closed" style={{}}>
                            <button
                              onClick={onClickBar}
                              aria-label="Hide sidebar"
                              className=" p-3 gap-2 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md hover:bg-gray-500/10 h-11 w-180 flex-shrink-0 items-center justify-center" style={{ backgroundColor: "#313A46", marginLeft: "auto" }}
                            >
                              <svg
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect x="4" y="1" width="18" height="18" rx="2" ry="1"></rect>
                                <line x1="10" y1="1" x2="10" y2="19"></line>
                              </svg>

                            </button>
                          </span>
                        </div>
                        <div className="mb-1 flex flex-row gap-3" >

                          <button onClick={onClickNewNote} className="flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md hover:bg-gray-500/10 h-11 flex-shrink-0 flex-grow" style={{ height: "50px", backgroundColor: "#475465", borderStyle: "none", margin: "10px 10px 0px 10px", borderRadius: "10px", boxShadow: "1px 1px black" }}  >
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
                              <line x1={12} y1={5} x2={12} y2={19} />
                              <line x1={5} y1={12} x2={19} y2={12} />
                            </svg>
                            <p style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "17px", margin: "auto", marginRight: "50px" }}>New note</p>

                          </button>

                        </div>
                        <div style={{ fontFamily: "Inter", fontWeight: "500", fontSize: "15px", marginTop: "12px", borderStyle: "solid", borderWidth: "1px 0px 0px 0px", borderColor: "white", marginLeft: "15px", marginRight: "15px" }}>
                          {histories ? histories
                            .slice()
                            .sort((a, b) => b.history_id - a.history_id)
                            .map((history) => (
                              <History
                                key={history.history_id}
                                id={history.history_id}
                                history={history.title}
                                onClickHistory={handleClickHistory}
                                isActive={selectedId === history.history_id}
                              />

                            )) : null}
                        </div>

                      </span>
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-2 empty:hidden">

                  <div className="group relative" data-headlessui-state="" style={{ backgroundColor: "#1B2027", borderRadius: "7px", marginBottom: "10px" }}>
                    <button onClick={onClickSetting}
                      className="flex w-full relative items-center gap-2.5 rounded-md px-3 py-3 text-sm transition-colors duration-200 hover:bg-gray-800 group-ui-open:bg-gray-800 border-t border-white/20"
                      id="headlessui-menu-button-:r8:"
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      data-headlessui-state=""
                    >
                      {isSetting ? <Logout /> : null}
                      <div className="flex-shrink-0 ">
                        <div className="relative flex ">
                          <span
                            style={{
                              boxSizing: "border-box",
                              display: "inline-block",
                              overflow: "hidden",
                              width: "initial",
                              height: "initial",
                              background: "none",
                              opacity: 1,
                              border: 0,
                              margin: 0,
                              padding: 0,
                              position: "relative",
                              maxWidth: "100%"
                            }}
                          >
                            <span
                              style={{
                                boxSizing: "border-box",
                                display: "block",
                                width: "initial",
                                height: "initial",
                                background: "none",
                                opacity: 1,
                                border: 0,
                                margin: 0,
                                padding: 0,
                                maxWidth: "100%"
                              }}
                            >

                            </span>
                            <img
                              src={person}
                              style={{ width: "20px" }}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="text-lg grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white" style={{ fontFamily: "Inter", fontWeight: "700" }}>
                        {userName}
                      </div>
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx={12} cy={12} r={1} />
                        <circle cx={19} cy={12} r={1} />
                        <circle cx={5} cy={12} r={1} />
                      </svg>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div >
      </div >
    </>

  )

}

Sidebar.propTypes = {
  histories: PropTypes.array
}
export default Sidebar