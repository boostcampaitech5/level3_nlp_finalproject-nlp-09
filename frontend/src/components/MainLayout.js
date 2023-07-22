import { useState } from "react"
import Upload from "./Upload"
import UploadUrl from "./UploadUrl"

const MainLayout = ( { onUpload } ) => {
  const [ which, setWhich ] = useState( true );
  const handleUpload = ( id ) => {
    onUpload( id )
  }
  return (
    <div className="relative flex h-full max-w-full flex-1 overflow-hidden">
      <div className="flex h-full max-w-full flex-1 flex-col">
        <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
          <div className="absolute right-4 top-2 z-10 hidden flex-col gap-2 md:flex" />
          <div className="flex-1 overflow-hidden">
            <div className="react-scroll-to-bottom--css-tbfcu-79elbk h-full dark:bg-gray-800">
              <div className="react-scroll-to-bottom--css-tbfcu-1n7m0yu">
                <div className="flex flex-col text-sm dark:bg-gray-800">
                  <div className="text-gray-800 w-full mx-auto md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
                    <h1 className="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
                      Lec & Rec
                    </h1>
                    <div className="md:flex items-start text-center gap-3.5">

                      <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                        <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                            />
                          </svg>
                          Capabilities
                        </h2>
                        <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                          <li className="w-full text-lg bg-gray-50 dark:bg-white/5 p-7 rounded-md border">
                            <div>
                              Insert a link or Attach audio files
                            </div>
                            <div>
                              The audio file length can be up to 60 minutes
                            </div>

                          </li>

                        </ul>
                      </div>

                    </div>
                  </div>

                </div>
                <div className="flex flex-row gap-0 justify-center">
                  <button onClick={ () => { setWhich( true ) } } className="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 w-24 rounded-l-lg ">Link</button>
                  <button onClick={ () => { setWhich( false ) } } className="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 w-24 rounded-r-lg ">File</button>
                </div>
              </div>

            </div>

          </div>
          <div className="flex flex-col gap-2">

            { which ?
              <div className="flex gap-2 justify-center" style={ { position: "relative", top: "-100px" } }>
                <UploadUrl onUpload={ handleUpload } />
              </div>
              :
              <div className="flex gap-2 relative justify-center" style={ { position: "relative", top: "-100px" } }>
                <Upload onUpload={ handleUpload } />
              </div> }
          </div>
        </main>
      </div >
    </div >
  )
}

export default MainLayout