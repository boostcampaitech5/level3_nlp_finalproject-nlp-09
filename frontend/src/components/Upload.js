import React, { useRef } from 'react';
import axios from 'axios';

const Form = () => {
  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isFileUpload, setIsFileUpload] = React.useState(false);
  const [fileName, setFileName] = React.useState("")
  const realInput = useRef();
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    try {
      const response = await axios({
        method: "post",
        url: "/api/upload/file",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log(error)
    }
  }

  const handleFileSelect = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      console.log(event.target.files[0])
      setFileName(event.target.files[0]['name'])
      setIsFileUpload(true);
    }
  }
  const onClick = () => {
    realInput.current.click();
  }
  return (
    <div>
      {isFileUpload ? <span class="flex flex-row justify-center">{fileName}</span> : null}
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input style={{ display: "none" }} type="file" accept="audio/*, .jpeg, .zip" ref={realInput} onChange={handleFileSelect} />

        {isFileUpload ? null : <button onClick={onClick} class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded">Upload File</button>}
        {isFileUpload ? <button type="button" onClick={onClick} class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" >Reupload</button> : null}
        {isFileUpload ? <button class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" type="submit">GO</button> : null}

      </form>
    </div>
  )
};

export default Form;