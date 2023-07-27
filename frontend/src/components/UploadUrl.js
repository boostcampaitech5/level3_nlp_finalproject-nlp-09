import React, { useRef } from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import { useNavigate } from 'react-router-dom';
import { tokenExpiration } from "../utils/Logout";
import Loading from './Loading';

const UploadUrl = ({ onUpload }) => {
  // a local state to store the currently selected file.
  const [isFileUpload, setIsFileUpload] = React.useState(false);
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [text, setText] = React.useState("")
  const navigate = useNavigate()

  const onChange = (event) => {
    setText(event.target.value)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(event)
    const formData = new FormData();
    formData.append("url", text);
    formData.append("access_token", cookie.load('user').accessToken);
    setIsSubmit(true);
    try {
      const response = await axios({
        method: "post",
        url: `http://${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/upload_link`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload data", response.data)
      const result = response.data;
      if (tokenExpiration(result.message)) {
        navigate('/')
      }
      onUpload(result.history.history_id)

    } catch (error) {
      console.log(error)

    }

  }

  const onClick = () => {

    setIsFileUpload((bool) => !bool)
  }
  return (
    <div>
      {
        isSubmit ? <div><Loading /></div> :
          // url input
          <div className="flex w-full flex-col gap-10">




            {isFileUpload ? <span class="flex flex-row justify-center">{text}</span> : null}
            <form onSubmit={handleSubmit} className='flex flex-row gap-2 itmes-center' style={{ width: "100%" }}>

              {isFileUpload ? null :
                <div className="flex flex-row justify-center" >
                  <input type="text" onChange={onChange} value={text} placeholder="Put your audio link" className="flex w-full gap-2 bg-white-600 hover:bg-white-800 relative text-black py-2.5 px-20 sm:px-80 rounded border-3 border-slate-500 text-center" style={{ width: "600px", height: "40px", padding: "0px 10px" }} />
                  <button type="button" onClick={onClick} class="bg-slate-700 hover:bg-slate-800 relative text-white py-1 px-3 rounded" style={{ fontFamily: "Inter", fontWeight: "800" }}>Upload</button>
                </div>
              }
              {isFileUpload ? <div className="flex w-full flex-row justify-center gap-2">
                <button type="button" onClick={onClick} class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" >Reupload</button>
                <button class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" type="submit">GO</button>
              </div> : null}


            </form>
          </div >
      }
    </div >
  )
};

export default UploadUrl;