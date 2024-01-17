import React, { useEffect, useRef, useState } from "react";
import vhCheck from "vh-check";
import "../styles/Login.css";
import { BarLoader } from "react-spinners";
// import { calenderSetDarkTheme, calenderSetLightTheme } from "../helpers";
import { LoginProps } from "../global/types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
vhCheck("vh-check");

function Login(props: LoginProps) {
  const invalidPwdMsgRef = useRef<HTMLInputElement>(null);
  const [isPwdDisabled, setPwdDisabled] = useState(false);
  const userIDorMailRef = useRef<HTMLInputElement>(null);
  const [isModeLoaded, setIsModeLoaded] = useState(true);
  const [policyAccepted, setPolicyAccepted] = useState<boolean>(Boolean(localStorage.getItem("privacyPolicyAccepted")));
  const navigate = useNavigate();

  const onSubmitPwd = () => {
    if (!policyAccepted) {
      props.setLoginErrorMsg("You must agree to the privacy policy!");
      invalidPwdMsgRef.current!.style.display = "block";
      return;
    }
    if (!props.pwdRef.current!.value || !userIDorMailRef.current!.value) return;
    const userPWD = props.pwdRef.current!.value;
    const userIDorMail = userIDorMailRef.current!.value;
    setPwdDisabled(true);
    axios
      .post("http://localhost:4000/login/", { userIDorMail, userPWD })
      .then(() => {
        navigate("/dartscounter");
        setPwdDisabled(false);
      })
      .catch((error) => {
        setPwdDisabled(false);
        console.log("dsd", error);
        if (error.response.status === 429) props.setLoginErrorMsg(error.response.statusText);
        else {
          console.log(error.response.status);
          props.setLoginErrorMsg("This password or username is invalid");
        }
        invalidPwdMsgRef.current!.style.display = "block";
        setTimeout(() => {
          document.getElementById("pwdInput")?.focus();
        }, 0);
      });
  };

  const onEnterPressed = (e: any) => {
    if (e.keyCode === 13) onSubmitPwd();
  };

  const onChangeHideInvalidPwdMsg = () => {
    if ((invalidPwdMsgRef.current!.style.display = "block")) invalidPwdMsgRef.current!.style.display = "none";
  };

  useEffect(() => {}, []);

  return (
    <>
      {isModeLoaded ? (
        <div className="hero is-fullheight ">
          {isPwdDisabled ? <BarLoader id="top-barloader" color={"#00d1b2"} width={"100%"} /> : null}
          <div className="hero-body  is-justify-content-center is-align-items-center">
            <div className="columns is-half is-flex-direction-column box">
              <div className="column is-flex is-justify-content-center">
                <h1 className="is-size-5">Login</h1>
              </div>
              <div className="column">
                <input
                  ref={userIDorMailRef}
                  disabled={isPwdDisabled}
                  autoFocus
                  onChange={onChangeHideInvalidPwdMsg}
                  onKeyUp={onEnterPressed}
                  className="input is-primary"
                  placeholder="username or mail"
                />
              </div>
              <div className="column">
                <input
                  id="pwdInput"
                  ref={props.pwdRef}
                  disabled={isPwdDisabled}
                  onChange={onChangeHideInvalidPwdMsg}
                  onKeyUp={onEnterPressed}
                  className="input is-primary"
                  type="password"
                  placeholder="password"
                />
                <p ref={invalidPwdMsgRef} style={{ display: "none" }} className="help is-danger">
                  {props.loginErrorMsg}
                </p>
              </div>
              <div className="column policy">
                <input
                  type="checkbox"
                  defaultChecked={policyAccepted}
                  onChange={() => {
                    setPolicyAccepted(!policyAccepted);
                  }}
                />
                I agree to the{" "}
                <a className="policyLink" href="" target="_blank">
                  privacy policy
                </a>
              </div>
              <div className="column">
                <button
                  onClick={onSubmitPwd}
                  disabled={isPwdDisabled}
                  className="button is-primary is-fullwidth"
                  type="submit"
                >
                  Login
                </button>
              </div>
              <div className="has-text-centered">
                <p className="is-size-7">
                  <span tabIndex={0}>
                    <Link to={"/register"}>Register</Link>
                  </span>{" "}
                  -&nbsp;
                  <a href="" className="has-text-danger">
                    Help?
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Login;
