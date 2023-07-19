import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "../components/Logout"
import History from "../components/History"
import MainGridSumm from "./MainGridSumm";

function MainSumm() {
  const [ isButtonHidden, setIsButtonHidden ] = useState( true );
  const [ isSetting, setIsSetting ] = useState( false );
  const [ userName, setUserName ] = useState( "" )
  const location = useLocation();
  const userInfo = location.state;
  const navigate = useNavigate();
  //useEffect( () => { console.log( "wait" ); setUserName( userInfo.userName ) }, [] )
  const onClickSetting = () => {
    setIsSetting( ( bool ) => !bool )
  }
  const onClickBar = () => {
    setIsButtonHidden( ( bool ) => !bool )
  }
  const onClickNote = () => {
    navigate( '/main' )
  }
  console.log( isButtonHidden )
  return (
    <div >

      <>
        <div id="__next">

          <div className="overflow-hidden w-full h-full relative flex z-0">

            { isButtonHidden ? null : <button onClick={ onClickBar } style={ { position: "relative", top: "8px", left: "8px" } } aria-label="Show sidebar" class="flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border bg-white dark:bg-gray-800 border-black/10 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-gray-700 h-11"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-black dark:text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></button> }
            <div
              className="dark flex-shrink-0 overflow-x-hidden bg-gray-900"
              style={ { visibility: isButtonHidden ? "visible" : "hidden", width: isButtonHidden ? 260 : 0, } }
            >

              <div className="h-full w-[260px]">
                <div className="flex h-full min-h-0 flex-col ">
                  <div className="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20">
                    <h2
                      style={ {
                        position: "absolute",
                        border: 0,
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: "-1px",
                        overflow: "hidden",
                        clip: "rect(0px, 0px, 0px, 0px)",
                        whiteSpace: "nowrap",
                        overflowWrap: "normal"
                      } }
                    >
                      Chat history
                    </h2>
                    <nav
                      className="flex h-full w-full flex-col p-2"
                      aria-label="Chat history"
                    >
                      <div className="mb-1 flex flex-row gap-3">

                        <button onClick={ onClickNote } className="flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 flex-shrink-0 flex-grow">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth={ 2 }
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <line x1={ 12 } y1={ 5 } x2={ 12 } y2={ 19 } />
                            <line x1={ 5 } y1={ 12 } x2={ 19 } y2={ 12 } />
                          </svg>
                          New note
                        </button>
                        <span className="" data-state="closed">
                          <button
                            onClick={ onClickBar }
                            aria-label="Hide sidebar"
                            className=" p-3 gap-2 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 w-180 flex-shrink-0 items-center justify-center"
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

                      <div className="absolute left-0 top-14 z-20 overflow-hidden transition-all duration-500 invisible max-h-0">
                        <div className="bg-gray-900 px-4 py-3">
                          <div className="p-1 text-sm text-gray-100">
                            Chat History is off for this browser.
                          </div>
                          <div className="p-1 text-xs text-gray-500">
                            When history is turned off, new chats on this browser
                            won't appear in your history on any of your devices, be
                            used to train our models, or stored for longer than 30
                            days.{ " " }
                            <strong>
                              This setting does not sync across browsers or devices.
                            </strong>{ " " }
                            <a
                              href="https://help.openai.com/en/articles/7730893"
                              target="_blank"
                              className="underline"
                              rel="noreferrer"
                            >
                              Learn more
                            </a>
                          </div>

                          <button className="btn relative btn-primary mt-4 w-full">
                            <div className="flex w-full gap-2 items-center justify-center">
                              <svg
                                stroke="currentColor"
                                fill="none"
                                strokeWidth={ 2 }
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                                <line x1={ 12 } y1={ 2 } x2={ 12 } y2={ 12 } />
                              </svg>
                              Enable chat history
                            </div>
                          </button>
                        </div>
                        <div className="h-24 bg-gradient-to-t from-gray-900/0 to-gray-900" />
                      </div>
                      <div className="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
                        <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
                          <div>
                            <span>
                              <div
                                className="relative"
                                data-projection-id={ 1 }
                                style={ { height: "auto", opacity: 1 } }
                              >
                                <div
                                  className="sticky top-0 z-[16]"
                                  data-projection-id={ 39 }
                                  style={ { transform: "none", transformOrigin: "50% 50% 0px", opacity: 1 } }
                                >
                                  <h3 className="h-10 pb-2 pt-3 px-3 text-lg text-gray-500 font-medium text-ellipsis overflow-hidden break-all bg-gray-900">
                                    History
                                  </h3>

                                </div>
                                <div>
                                  <History />
                                  <History />
                                </div>
                              </div>
                            </span>
                            <span />
                            <span />
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-white/20 pt-2 empty:hidden">
                        <div
                          id="webchatgpt-prompt-switch"
                          className="flex items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-800 rounded-md"
                        />

                        <div className="group relative" data-headlessui-state="">
                          <button onClick={ onClickSetting }
                            className="flex w-full items-center gap-2.5 rounded-md px-3 py-3 text-sm transition-colors duration-200 hover:bg-gray-800 group-ui-open:bg-gray-800 border-t border-white/20"
                            id="headlessui-menu-button-:r8:"
                            type="button"
                            aria-haspopup="true"
                            aria-expanded="false"
                            data-headlessui-state=""
                          >
                            { isSetting ? <Logout /> : null }
                            <div className="flex-shrink-0 ">
                              <div className="relative flex ">
                                <span
                                  style={ {
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
                                  } }
                                >
                                  <span
                                    style={ {
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
                                    } }
                                  >
                                    <img
                                      alt=""
                                      aria-hidden="true"
                                      src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2728%27%20height=%2728%27/%3e"
                                      style={ {
                                        display: "block",
                                        maxWidth: "100%",
                                        width: "initial",
                                        height: "initial",
                                        background: "none",
                                        opacity: 1,
                                        border: 0,
                                        margin: 0,
                                        padding: 0
                                      } }
                                    />
                                  </span>
                                  <img
                                    alt="User"
                                    src="https://res.cloudinary.com/di0dhswld/image/upload/v1689404643/Lec___Rec-removebg-preview_8_obihjq.png"
                                    decoding="async"
                                    data-nimg="intrinsic"
                                    className="rounded-sm"
                                    srcSet="https://res.cloudinary.com/di0dhswld/image/upload/v1689404643/Lec___Rec-removebg-preview_8_obihjq.png"
                                    style={ {
                                      position: "absolute",
                                      inset: 0,
                                      boxSizing: "border-box",
                                      padding: 0,
                                      border: "none",
                                      margin: "auto",
                                      display: "block",
                                      width: 0,
                                      height: 0,
                                      minWidth: "100%",
                                      maxWidth: "100%",
                                      minHeight: "100%",
                                      maxHeight: "100%"
                                    } }
                                  />
                                </span>
                              </div>
                            </div>
                            <div className="text-lg grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white">
                              { userName }
                            </div>
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth={ 2 }
                              viewBox="0 0 24 24"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 flex-shrink-0 text-gray-500"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx={ 12 } cy={ 12 } r={ 1 } />
                              <circle cx={ 19 } cy={ 12 } r={ 1 } />
                              <circle cx={ 5 } cy={ 12 } r={ 1 } />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <MainGridSumm />
          </div>
          <div
            role="region"
            aria-label="Notifications (F8)"
            tabIndex={ -1 }
            style={ { pointerEvents: "none" } }
          >
            <ol
              tabIndex={ -1 }
              className="z-100 fixed bottom-0 right-0 m-0 flex  max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]"
            />
          </div>
          <div className="absolute left-0 right-0 top-0 z-[2]" />
        </div>
        <next-route-announcer>
          <p
            aria-live="assertive"
            id="__next-route-announcer__"
            role="alert"
            style={ {
              border: 0,
              clip: "rect(0px, 0px, 0px, 0px)",
              height: 1,
              margin: "-1px",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              top: 0,
              width: 1,
              whiteSpace: "nowrap",
              overflowWrap: "normal"
            } }
          />
        </next-route-announcer>
        <div portal-container="">
          <span className="pointer-events-none fixed inset-0 z-[60] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
        </div>



      </>

    </div >

  )
}

export default MainSumm