import React, { useRef } from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import { useNavigate } from 'react-router-dom';
import { tokenExpiration } from "../utils/Logout";
import Spinner from './Spinner';
import Loading from './Loading';

const Upload = ( { onUpload } ) => {
  // a local state to store the currently selected file.
  const [ selectedFile, setSelectedFile ] = React.useState( null );
  const [ isFileUpload, setIsFileUpload ] = React.useState( false );
  const [ fileName, setFileName ] = React.useState( "" )
  const [ isSubmit, setIsSubmit ] = React.useState( false );
  const navigate = useNavigate()

  const realInput = useRef();
  const handleSubmit = async ( event ) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append( "file", selectedFile );
    formData.append( "access_token", cookie.load( 'user' ).accessToken );
    setIsSubmit( true );
    try {
      const response = await axios( {
        method: "post",
        url: "http://localhost:8000/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      } );
      console.log( "Upload data", response.data )
      const result = response.data;
      if ( tokenExpiration( result.message ) ) {
        navigate( '/' )
      }
      onUpload( result.history.history_id )

    } catch ( error ) {
      console.log( error )

    }

  }

  const handleFileSelect = ( event ) => {
    if ( event.target.files[ 0 ] ) {
      setSelectedFile( event.target.files[ 0 ] )
      console.log( event.target.files[ 0 ] )
      setFileName( event.target.files[ 0 ][ 'name' ] )
      setIsFileUpload( true );
    }
  }
  const onClick = () => {
    realInput.current.click();
  }
  return (
    <div>
      {
        isSubmit ? <div><Loading /></div> :
          <div>
            { isFileUpload ? <span class="flex flex-row justify-center">{ fileName }</span> : null }
            <form onSubmit={ handleSubmit } className='flex gap-2'>
              <input style={ { display: "none" } } type="file" accept="audio/*," ref={ realInput } onChange={ handleFileSelect } />

              { isFileUpload ? null : <button type="button" onClick={ onClick } class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded">Upload File</button> }
              { isFileUpload ? <button type="button" onClick={ onClick } class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" >Reupload</button> : null }
              { isFileUpload ? <button class="bg-slate-700 hover:bg-slate-800 relative text-white py-2.5 px-10 rounded" type="submit">GO</button> : null }


            </form>
          </div>
      }
    </div>
  )
};

export default Upload;