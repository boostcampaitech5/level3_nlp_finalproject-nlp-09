import React, { useRef } from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import { useNavigate } from 'react-router-dom';
import { tokenExpiration } from "../utils/Logout";
import Loading from './Loading';

const Upload = ({ onUpload }) => {
  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isFileUpload, setIsFileUpload] = React.useState(false);
  const [fileName, setFileName] = React.useState("")
  const [isSubmit, setIsSubmit] = React.useState(false);
  const navigate = useNavigate()

  const realInput = useRef();
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("access_token", cookie.load('user').accessToken);
    setIsSubmit(true);
    try {
      const response = await axios({
        method: "post",
        url: `http://${process.env.REACT_APP_SERVER_URL}/upload`,
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

  const handleFileSelect = (event) => {

    if (event.target.files[0]) {
      const file = event.target.files[0];

      // Check if a file is selected
      if (file) {
        // Set the maximum file size limit in bytes (e.g., 5 MB)
        const maxSizeInBytes = 120 * 1024 * 1024; // 120 MB

        // Check if the file size exceeds the limit
        if (file.size > maxSizeInBytes) {
          alert('File size exceeds the limit (5 MB). Please select a smaller file.');

        }
        else {
          setSelectedFile(event.target.files[0])
          console.log(event.target.files[0])
          setFileName(event.target.files[0]['name'])
          setIsFileUpload(true);
        }
      }
    }
  }
  const onClick = () => {
    realInput.current.click();
  }
  return (
    <div>
      {
        isSubmit ? <div><Loading /></div> :
          // url input
          <div className="flex w-full flex-col gap-10">




            {isFileUpload ? <span class="flex flex-row justify-center" style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "18px" }}>{fileName}</span> : null}
            <form onSubmit={handleSubmit} className='flex flex-row gap-2 itmes-center'>
              <input style={{ display: "none" }} type="file" accept=".mp3, .mp4, .m4a, .wav" ref={realInput} onChange={handleFileSelect} />

              {isFileUpload ? null : <button type="button" onClick={onClick} class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded " style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "19px", width: "200px", height: "70px" }}>Upload File</button>}
              {isFileUpload ? <button type="button" onClick={onClick} class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "15px", width: "150px", height: "50px" }}>Reupload</button> : null}
              {isFileUpload ? <button class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" type="submit" style={{ fontFamily: "Inter", fontWeight: "800", fontSize: "15px", width: "100px", height: "50px" }}>GO</button> : null}


            </form>
          </div>
      }
    </div >
  )
};

export default Upload;