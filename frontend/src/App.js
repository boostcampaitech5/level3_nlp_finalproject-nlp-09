import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from "./routes/Home"
import Login from "./routes/Login";
import Password from "./routes/Password";
import SignUpId from "./routes/SignUpId";
import SignUpPassword from "./routes/SignUpPassword";
import Main from "./routes/Main";
import MainRec from "./routes/MainRec";
import MainSumm from "./routes/MainSumm";
import MainQues from "./routes/MainQues";

function App() {
  return ( <Router>
    <Routes>
      <Route path="/" element={ <Home /> }>
      </Route>
      <Route path="/auth/login" element={ <Login /> }></Route>
      <Route path="/auth/login/password" element={ <Password /> }></Route>
      <Route path="/auth/signup" element={ <SignUpId /> }></Route>
      <Route path="/auth/signup/password" element={ <SignUpPassword /> }></Route>
      <Route path="/main" element={ <Main /> }></Route>
      <Route path="/main/record" element={ <MainRec /> } />
      <Route path="/main/summary" element={ <MainSumm /> } />
      <Route path="/main/question" element={ <MainQues /> } />
    </Routes>
  </Router>
  )
}

export default App;