import {
  Routes,
  Route,
} from "react-router-dom";
import Home from "./routes/Home"
import Login from "./routes/Login";
import Password from "./routes/Password";
import SignUpId from "./routes/SignUpId";
import SignUpPassword from "./routes/SignUpPassword";
import Main from "./routes/Main";


function App() {
  return (
    <Routes>
      <Route path="/" element={ <Home /> }></Route>
      <Route path="/auth/login" element={ <Login /> }></Route>
      <Route path="/auth/login/password" element={ <Password /> }></Route>
      <Route path="/auth/signup" element={ <SignUpId /> }></Route>
      <Route path="/auth/signup/password" element={ <SignUpPassword /> }></Route>
      <Route path="/main/*" element={ <Main /> }></Route>
    </Routes>

  )
}

export default App;