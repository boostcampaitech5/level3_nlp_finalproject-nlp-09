import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from "../components/logo2.svg"

function Login() {
  const [userName, setUserName] = useState('');
  let navigate = useNavigate();
  const onSubmit = (event) => {
    event.preventDefault()
    const id = event.target[0].value;
    if (id === "") {
      <div>invalid</div>
    }
    setUserName(id);
    console.log("ID", id)
    let body = {
      user_id: id
    }
    axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/id_validation`, body).then((res) => {
      console.log(res.data)
      const result = res.data

      if (result.type) {
        let path = '/auth/login/password';
        navigate(path, { state: { userName: id } });
      }
      else {
        console.log(result.message)
      }

    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
    });

  }

  return (
    <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: "100vh" }}>
      <>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="stylesheet"
          href="https://cdn.auth0.com/ulp/react-components/1.75.5/css/main.cdn.min.css"
        />
        <style
          id="custom-styles-container"
          dangerouslySetInnerHTML={{
            __html:
              "\n      \n        \n\nbody {\n  background: #ffffff;\n  font-family: ulp-font, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, sans-serif;\n}\n.cb8b84e38 {\n  background: #ffffff;\n}\n.c491ad4bf.c1b0fd04f {\n  background: #D00E17;\n}\n.c491ad4bf.c0d31bf3e {\n  background: #0A8852;\n}\n.c08709d93 {\n  background-color: #10a37f;\n  color: #ffffff;\n}\n.c08709d93 a,\n.c08709d93 a:visited {\n  color: #ffffff;\n}\n.c23329ebf {\n  background-color: #0A8852;\n}\n.cb393dcca {\n  background-color: #D00E17;\n}\n@supports (mask-image: url('/static/img/branding-generic/copy-icon.svg')) {\n  @supports not (-ms-ime-align: auto) {\n    .ccf254d7e.cdf0e5eff::before {\n      background-color: #D00E17;\n    }\n  }\n}\n.input.ccb840dba {\n  border-color: #D00E17;\n}\n.error-cloud {\n  background-color: #D00E17;\n}\n.error-fatal {\n  background-color: #D00E17;\n}\n.error-local {\n  background-color: #D00E17;\n}\n#alert-trigger {\n  background-color: #D00E17;\n}\n      \n    "
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n      /* By default, hide features for javascript-disabled browsing */\n      /* We use !important to override any css with higher specificity */\n      /* It is also overriden by the styles in <noscript> in the header file */\n      .no-js {\n        clip: rect(0 0 0 0);\n        clip-path: inset(50%);\n        height: 1px;\n        overflow: hidden;\n        position: absolute;\n        white-space: nowrap;\n        width: 1px;\n      }\n    "
          }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html:
              '\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIRegular.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIRegular.woff) format("woff");\n        font-weight: normal;\n        font-style: normal;\n    }\n\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIRegularItalic.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIRegularItalic.woff) format("woff");\n        font-weight: normal;\n        font-style: italic;\n    }\n\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIBold.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIBold.woff) format("woff");\n        font-weight: bold;\n        font-style: normal;\n    }\n\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIBoldItalic.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIBoldItalic.woff) format("woff");\n        font-weight: bold;\n        font-style: italic;\n    }\n\n    :root {\n        --font-family: "ColfaxAI",-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;\n        --primary-color: #10a37f;\n        --primary-color-no-override: #10a37f;\n        --action-primary-color: #10a37f;\n        --link-color: #10a37f;\n        --input-box-shadow-depth: 1px;\n        --page-background-color: #ffffff;\n    }\n\n    body {\n        font-family: var(--font-family);\n        background-color: var(--page-background-color);\n    }\n\n    .oai-wrapper {\n        display: flex;\n        flex-direction: column;\n        justify-content: space-between;\n        min-height: 100%;\n    }\n\n    .oai-header {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 32px 0 0;\n        flex: 0 0 auto;\n    }\n    .oai-header svg {\n        width: 32px;\n        height: 32px;\n        fill: #202123;\n    }\n\n    .oai-footer {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        color: #6e6e80;\n        padding: 12px 0 24px;\n        flex: 0 0 auto;\n    }\n    .oai-footer a {\n        color: var(--primary-color);\n        margin: 0 10px;\n    }\n\n    ._widget-auto-layout main._widget {\n        flex: 1 0 auto;\n        min-height: 0;\n    }\n\n    main header > img:first-of-type {\n        display: none;\n    }\n    main > section, main > section > div:first-child {\n        box-shadow: none;\n    }\n    main header > h1 {\n        font-weight: bold !important;\n        font-size: 32px !important;\n    }\n    main a {\n        font-weight: normal !important;\n    }\n    .ulp-alternate-action {\n        text-align: center;\n    }\n    button[type="submit"] {\n        font-family: var(--font-family);\n    }\n\n    \n\n    \n        main header > h1 {\n            margin-bottom: 0 !important;\n        }\n    \n    \n        main header > h1 + div {\n            display: none !important;\n        }\n    \n    \n    \n        div:has(> form[data-provider]) {\n            display: flex;\n            flex-direction: column;\n        }\n        form[data-provider="google"] {\n            order: -1;\n        }\n        form[data-provider] {\n            margin-bottom: var(--spacing-1);\n        }\n    \n\n'
          }}
        />
      </>

      <div className="">
        <header className="oai-header" style={{ marginTop: "50px", marginBottom: "60px" }}>
          <img src={logo} style={{ width: "70px", float: "left", marginTop: "0px", marginRight: "10px" }}></img>
          <p style={{ fontFamily: "Inter", fontWeight: "900", fontSize: "50px" }}>Lec & Rec</p>
        </header>
        <main className="_widget login-id">
          <section className="ca775d19e _prompt-box-outer c20fc64c7">
            <div className="c4209fc2d ce0449bc6">
              <div className="cf12edc27">
                <h1 className="ce6e62a0a c7f8e3f9b" style={{ fontFamily: "Inter", fontWeight: "700", fontSize: "30px", marginBottom: "30px" }}>Welcome Back!</h1>
                <div className="ca920f895 ca8471e59">
                  <div className="ce1af4c6a ca1203c69">
                    <div className="cedacd3f9">
                      <form onSubmit={onSubmit}
                        // method="POST"
                        className="c210378a2 _form-login-id"
                        data-form-primary="true"
                      >

                        <div className="ce1af4c6a ca1203c69">
                          <div className="cedacd3f9">
                            <div className="input-wrapper _input-wrapper">
                              <div
                                className="c7ab7dc9b c0019dde8 text cf3b89ce0 cd6d391ac c1c5e48dd"
                                data-action-text=""
                                data-alternate-action-text=""
                              >

                                <input
                                  className="input ca4b7f6ee c41431cc2 hover:gray-800"
                                  inputMode="email"
                                  name="username"
                                  id="username"
                                  type="text"
                                  defaultValue=""
                                  required=""
                                  placeholder='Id'
                                  autoComplete="username"
                                  autoCapitalize="none"
                                  spellCheck="false"


                                />

                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="cf772ffae">
                          <button
                            type="submit"
                            name="action"
                            value="default"
                            className="c89f1057d c08709d93 cfdf7e7ce c948a708e _button-login-id"
                            data-action-button-primary="true"
                            style={{ backgroundColor: "#717171", fontFamily: "Inter", fontWeight: "700", borderRadius: "10px", height: "60px", marginTop: "40px" }}

                          >
                            Continue
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="ulp-alternate-action  _alternate-action __s16nu9" style={{ fontFamily: "Inter", fontWeight: "400" }}>
                    <p className="c27bed2f2 c864e0c2d c2292b410">
                      Don't have an account?
                      <a
                        className="cea0519b1 cf0e47f86"
                        href="/auth/signup"
                        aria-label=""
                        style={{ color: "#2052D4" }}
                      >
                        Sign up
                      </a>
                    </p>
                  </div>


                </div>
              </div>
            </div>
          </section >
        </main >
        <footer className="oai-footer">
          <a href="" target="_blank">

          </a>{" "}
          {" "}
          <a href="" target="_blank">

          </a>
        </footer>
      </div >
    </div >

  )
}

export default Login; 