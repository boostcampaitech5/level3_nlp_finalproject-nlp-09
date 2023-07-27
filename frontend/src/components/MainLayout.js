import { useState } from "react"
import Upload from "./Upload"
import UploadUrl from "./UploadUrl"

const MainLayout = ({ onUpload }) => {
  const [which, setWhich] = useState(true);
  const handleUpload = (id) => {
    onUpload(id)
  }
  return (
    <div className="relative flex h-full max-w-full flex-1 overflow-hidden">
      <div className="flex h-full max-w-full flex-1 flex-col">
        <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
          <div className="absolute right-4 top-2 z-10 hidden flex-col gap-2 md:flex" />
          <div className="flex-1 overflow-hidden">
            <div className="react-scroll-to-bottom--css-tbfcu-79elbk h-full dark:bg-gray-800   overflow-y-scroll">
              <div className="react-scroll-to-bottom--css-tbfcu-1n7m0yu ">
                <div className="flex flex-col text-sm dark:bg-gray-800 ">
                  <div className="text-gray-800 w-full mx-auto md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
                    <h1 className="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center" style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "50px", marginBottom: "120px" }}>
                      Lec & Rec
                    </h1>
                    <div className="md:flex items-start text-center gap-3.5">

                      <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">

                        <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                          <li className="w-full text-lg bg-gray-50 dark:bg-white/5 rounded-md pt-7">
                            <div style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "21px", marginBottom: "45px", color: "#56657A" }}>
                              강의 유튜브 링크 또는 음성 파일을 넣어주세요<br /><br />
                              속기, 요약, 퀴즈를 만들어 드릴게요
                            </div>
                            <div style={{ fontFamily: "Inter", fontWeight: "500", fontSize: "17px", color: "#5F7087", marginBottom: "30px" }}>
                              mp3, mp4, m4a, wav 파일을 지원해요 <br />
                              음성 파일 크기는 최대 120 MB까지 가능해요<br />
                              길이는 60분 이내로 해주세요
                            </div>

                          </li>

                        </ul>
                      </div>

                    </div>
                  </div>

                </div>
                <div className="flex flex-row gap-0 justify-center">
                  <button onClick={() => { setWhich(true) }} className="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 w-24 rounded-l-lg " style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "18px", width: "196px", height: "50px", borderWidth: "0px 2px 0px 0px", borderStyle: "solid", borderColor: "white" }}>Link</button>
                  <button onClick={() => { setWhich(false) }} className="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 w-24 rounded-r-lg " style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "18px", width: "196px", height: "50px" }}>File</button>
                </div>
                <div className="flex flex-col gap-2">

                  {which ?
                    <div className="flex gap-2 justify-center" style={{ position: "relative", marginTop: "150px", marginBottom: "100px" }}>
                      <UploadUrl onUpload={handleUpload} />
                    </div>
                    :
                    <div className="flex gap-2 relative justify-center" style={{ position: "relative", marginTop: "150px", marginBottom: "100px" }}>
                      <Upload onUpload={handleUpload} />
                    </div>}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div >
    </div >
  )
}

export default MainLayout