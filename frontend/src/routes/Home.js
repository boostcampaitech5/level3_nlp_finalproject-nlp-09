import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Stack, Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";


function Home() {
  let navigate = useNavigate();
  const onClick = ( pathToGo ) => {
    let path = pathToGo;
    navigate( path );
  }

  return (
    <div style={ { alignItems: 'center', justifyContent: 'center', display: 'flex', height: "100vh", background: 'rgb(250, 250, 250)' } }>
      <div class="flex h-full w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div class="w-96 flex flex-col flex-auto justify-center items-center">
          <div class="mb-3">
            <img src="https://res.cloudinary.com/di0dhswld/image/upload/v1689404643/Lec___Rec-removebg-preview_8_obihjq.png" alt="Icon"></img>
          </div>
          <div class="mb-2 text-center">Welcome to Lec & Rec</div>
          <div class="mb-3 text-center">Log in with your account to continue</div>
          <div class="flex flex-row gap-2">
            <button onClick={ () => onClick( "/auth/login" ) } class="bg-custom-green hover:bg-green-700 relative text-white py-2.5 px-3 rounded" as="button">
              <div class="flex w-full gap-2 items-center justify-center text-sm">Log in</div>
            </button>
            <button onClick={ () => onClick( "/auth/signup" ) } class="bg-custom-green hover:bg-green-700 relative text-white py-2.5 px-3 rounded" as="button">
              <div class="flex w-full gap-2 items-center justify-center text-sm">Sign up</div>
            </button>
          </div>
        </div>
        <div class="py-3 text-xs">
          <a href="https://openai.com/policies/terms-of-use" target="_blank" class="mx-3 text-gray-500" rel="noreferrer">Terms of use</a>
          <span class="text-gray-600">|</span>
          <a href="https://openai.com/policies/privacy-policy" target="_blank" class="mx-3 text-gray-500" rel="noreferrer">Privacy policy</a>
        </div>
      </div>
      <div class="absolute left-0 right-0 top-0 z-[2]"></div>
    </div >
  );
}


export default Home;