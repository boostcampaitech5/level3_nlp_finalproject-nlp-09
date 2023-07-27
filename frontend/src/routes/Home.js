import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Stack, Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import logo from "../components/LecNRecIcon.png";

function Home() {
  let navigate = useNavigate();
  const onClick = (pathToGo) => {
    let path = pathToGo;
    navigate(path);
  }

  return (
    <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: "100vh", background: 'rgb(250, 250, 250)' }}>
      <div class="flex h-full w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div class="w-70 flex flex-col flex-auto justify-center items-center">
          <div class="mb-3" style={{ width: "400px" }}>
            <img src={logo} style={{ width: "70px", float: "left", marginTop: "10px" }}></img>
            <p style={{ fontFamily: "Inter", fontWeight: "900", fontSize: "60px" }}>Lec & Rec</p>
          </div>
          <div class="mb-2 text-center" style={{ fontFamily: "Inter", fontWeight: "900", fontSize: "22px", color: "#717171" }}>Welcome to Lec & Rec</div>
          <div class="mb-3 text-center" style={{ fontFamily: "Inter", fontWeight: "900", fontSize: "22px", color: "#717171" }}>Log in with your account to continue</div>
          <div class="flex flex-row gap-2" style={{ marginTop: "30px" }}>
            <button onClick={() => onClick("/auth/login")} style={{ fontFamily: "Inter", fontWeight: "700", fontSize: "25px", color: "white", backgroundColor: "#5F5F5F", width: "120px", height: "50px", borderRadius: "10px" }} as="button">
              <div class="flex w-full gap-2 items-center justify-center text-sm" style={{ fontSize: "16px", }}>Log in</div>
            </button>
            <button onClick={() => onClick("/auth/signup")} style={{ fontFamily: "Inter", fontWeight: "700", fontSize: "25px", color: "white", backgroundColor: "#5F5F5F", width: "120px", height: "50px", borderRadius: "10px" }} as="button">
              <div class="flex w-full gap-2 items-center justify-center text-sm" style={{ fontSize: "16px", }}>Sign up</div>
            </button>
          </div>
        </div>
        <div class="py-3 text-xs">
          <a href="" target="_blank" class="mx-3 text-gray-500" rel="noreferrer"></a>
          <span class="text-gray-600"></span>
          <a href="" target="_blank" class="mx-3 text-gray-500" rel="noreferrer"></a>
        </div>
      </div>
      <div class="absolute left-0 right-0 top-0 z-[2]"></div>
    </div >
  );
}


export default Home;