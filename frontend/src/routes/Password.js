import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import { useState } from "react";

function Password() {
  const location = useLocation();
  const userInfo = location.state;
  const [password, setPassword] = useState('')
  let navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault()
    const password = event.target[2].value;
    if (password === "") {
      <div>invalid</div>
    }
    setPassword(password);
    console.log("Password", password)
    let body = {
      user_id: userInfo.userName,
      password: password
    }
    axios.post("http://localhost:8000/token", body).then((res) => {
      console.log(res.data)
    }).catch(error => {
      // 요청 중 에러가 발생했을 때 처리
      console.error(error);
    });
    if (password) {
      let path = '/main';
      navigate(path, { state: { userName: userInfo.userName, userPassword: password } });
    }
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
        <noscript>
          &lt;style&gt; /* We use !important to override the default for js enabled */
    /* If the display should be other than block, it should be defined
    specifically here */ .js-required {"{"} display: none !important; {"}"}
          .no-js {"{"}
          clip: auto; clip-path: none; height: auto; overflow: auto; position: static;
          white-space: normal; width: var(--prompt-width);
          {"}"}
          &lt;/style&gt;
        </noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIRegular.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIRegular.woff) format("woff");\n        font-weight: normal;\n        font-style: normal;\n    }\n\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIRegularItalic.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIRegularItalic.woff) format("woff");\n        font-weight: normal;\n        font-style: italic;\n    }\n\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIBold.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIBold.woff) format("woff");\n        font-weight: bold;\n        font-style: normal;\n    }\n\n    @font-face {\n        font-family: "ColfaxAI";\n        src: url(https://cdn.openai.com/API/fonts/ColfaxAIBoldItalic.woff2) format("woff2"),\n            url(https://cdn.openai.com/API/fonts/ColfaxAIBoldItalic.woff) format("woff");\n        font-weight: bold;\n        font-style: italic;\n    }\n\n    :root {\n        --font-family: "ColfaxAI",-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;\n        --primary-color: #10a37f;\n        --primary-color-no-override: #10a37f;\n        --action-primary-color: #10a37f;\n        --link-color: #10a37f;\n        --input-box-shadow-depth: 1px;\n        --page-background-color: #ffffff;\n    }\n\n    body {\n        font-family: var(--font-family);\n        background-color: var(--page-background-color);\n    }\n\n    .oai-wrapper {\n        display: flex;\n        flex-direction: column;\n        justify-content: space-between;\n        min-height: 100%;\n    }\n\n    .oai-header {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 32px 0 0;\n        flex: 0 0 auto;\n    }\n    .oai-header svg {\n        width: 32px;\n        height: 32px;\n        fill: #202123;\n    }\n\n    .oai-footer {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        color: #6e6e80;\n        padding: 12px 0 24px;\n        flex: 0 0 auto;\n    }\n    .oai-footer a {\n        color: var(--primary-color);\n        margin: 0 10px;\n    }\n\n    ._widget-auto-layout main._widget {\n        flex: 1 0 auto;\n        min-height: 0;\n    }\n\n    main header > img:first-of-type {\n        display: none;\n    }\n    main > section, main > section > div:first-child {\n        box-shadow: none;\n    }\n    main header > h1 {\n        font-weight: bold !important;\n        font-size: 32px !important;\n    }\n    main a {\n        font-weight: normal !important;\n    }\n    .ulp-alternate-action {\n        text-align: center;\n    }\n    button[type="submit"] {\n        font-family: var(--font-family);\n    }\n\n    \n\n    \n        main header > h1 {\n            margin-bottom: 0 !important;\n        }\n    \n    \n        main header > h1 + div {\n            display: none !important;\n        }\n    \n    \n\n'
          }}
        />
      </>
      <div className="oai-wrapper">
        <header className="oai-header">
          <img src="https://res.cloudinary.com/di0dhswld/image/upload/v1689404643/Lec___Rec-removebg-preview_8_obihjq.png" alt="Icon"></img>
        </header>
        <main className="_widget login">
          <section className="ca775d19e _prompt-box-outer c20fc64c7">
            <div className="c4209fc2d ce0449bc6">
              <div className="cf12edc27">
                <header className="c6f6f3748 cb3cf2f60">
                  <div
                    title="OpenAI"
                    id="custom-prompt-logo"
                    style={{
                      width: "auto !important",
                      height: "60px !important",
                      position: "static !important",
                      margin: "auto !important",
                      padding: "0 !important",
                      backgroundColor: "transparent !important",
                      backgroundPosition: "center !important",
                      backgroundSize: "contain !important",
                      backgroundRepeat: "no-repeat !important"
                    }}
                  />
                  <img
                    className="c41e1d961 ce5e08e7e"
                    id="prompt-logo-center"
                    src="https://openai.com/content/images/2019/05/openai-avatar.png"
                    alt="OpenAI"
                  />
                  <h1 className="ce6e62a0a c7f8e3f9b">Enter your password</h1>
                  <div className="cfdfdef49 c35d477ce">
                    <p className="c27bed2f2 c864e0c2d">
                      Enter your password for OpenAI to continue to Apps Client
                    </p>
                  </div>
                </header>
                <div className="ca920f895 ca8471e59">
                  <form
                    onSubmit={onSubmit}
                    // method="POST"
                    className="c210378a2 _form-login-password"
                    data-form-primary="true"
                  >
                    <input
                      type="hidden"
                      name="state"
                      defaultValue="hKFo2SB4MVg0LWlUekhMekNiLVBUME9pcU9nT1ZOTlFBYk56LaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIFU4bmRUOWJnUmtBT1ZjVUIwQ1FNUjg4SEpIRnZZMmdoo2NpZNkgVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEc"
                    />
                    <div
                      style={{
                        visibility: "hidden !important",
                        position: "absolute !important"
                      }}
                      aria-hidden="true"
                    >
                      {/* <button
                        type="submit"
                        name="action"
                        value="default"
                        style={{ visibility: "hidden !important" }}
                        aria-hidden="true"
                        tabIndex={-1}
                      >
                        Continue
                      </button> */}
                    </div>
                    <div className="ce1af4c6a ca1203c69">
                      <div className="cedacd3f9">
                        <div>
                          <div className="cf35dd666 cf3d2d46d c1fa9dca7 c17c20089">
                            <span className="ulp-authenticator-selector-text">
                              {userInfo.userName}
                            </span>
                            <a
                              className="cea0519b1 cbe8879fc c4dfe2cf4 cf0e47f86"
                              href="/auth/login"
                              data-link-name="edit-username"
                              aria-label="Edit email address"
                            >
                              Edit
                            </a>
                            <input
                              type="text"
                              name="username"
                              defaultValue="dons97@naver.com"
                              autoComplete="username"
                              readOnly=""
                            />
                          </div>
                        </div>
                        <div className="input-wrapper _input-wrapper">
                          <div
                            className="ccf254d7e c86ee2179 password c153a3e93 c4f04ee33"
                            data-action-text=""
                            data-alternate-action-text=""
                          >
                            <label
                              className="c8db587cf no-js ce86485cd c0e77cb7c"
                              htmlFor="password"
                            >
                              Password
                            </label>
                            <input
                              className="input ca4b7f6ee c58cecd1f"
                              name="password"
                              id="password"
                              type="password"
                              required=""
                              autoComplete="current-password"
                              autoCapitalize="none"
                              spellCheck="false"
                              autofocus=""
                            />
                            <div
                              className="c8db587cf js-required ce86485cd c0e77cb7c"
                              data-dynamic-label-for="password"
                              aria-hidden="true"
                            >
                              Password
                            </div>
                            <button
                              type="button"
                              className="c89f1057d ulp-button-icon cfdf7e7ce _button-icon"
                              data-action="toggle"
                            >
                              <span
                                aria-hidden="true"
                                className="password-icon-tooltip show-password-tooltip"
                              >
                                Show password
                              </span>
                              <span
                                aria-hidden="true"
                                className="password-icon-tooltip hide-password-tooltip hide"
                              >
                                Hide password
                              </span>
                              <span
                                className="screen-reader-only password-toggle-label"
                                data-label="show-password"
                              >
                                Show password
                              </span>
                              <span
                                className="screen-reader-only password-toggle-label hide"
                                data-label="hide-password"
                              >
                                Hide password
                              </span>
                              <span
                                className="cef71cdbc password js-required"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="cf04b4726 c11c7c230">
                      <a
                        className="cea0519b1 c080f6e2f cf0e47f86"
                        href="/u/reset-password/request/Username-Password-Authentication?state=hKFo2SB4MVg0LWlUekhMekNiLVBUME9pcU9nT1ZOTlFBYk56LaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIFU4bmRUOWJnUmtBT1ZjVUIwQ1FNUjg4SEpIRnZZMmdoo2NpZNkgVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEc"
                        aria-label=""
                      >
                        Forgot password?
                      </a>
                    </p>
                    <div className="cf772ffae">
                      <button
                        type="submit"
                        name="action"
                        value="default"
                        className="c89f1057d c08709d93 cfdf7e7ce c948a708e _button-login-password"
                        data-action-button-primary="true"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                  <div className="ulp-alternate-action  _alternate-action __s16nu9">
                    <p className="c27bed2f2 c864e0c2d c2292b410">
                      Don't have an account?
                      <a
                        className="cea0519b1 cf0e47f86"
                        href="/auth/signup"
                        aria-label=""
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="oai-footer">
          <a href="https://openai.com/policies/terms-of-use" target="_blank">
            Terms of use
          </a>{" "}
          |{" "}
          <a href="https://openai.com/policies/privacy-policy" target="_blank">
            Privacy policy
          </a>
        </footer>
      </div>

    </div>
  )
}


export default Password
