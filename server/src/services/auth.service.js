const generateCode = require("../helpers/generateCode.helper");
const sendRegistrationEmail = require("../helpers/sendRegistrationEmail.helper");
const checkUserRegistered = require("../helpers/checkUserRegistered.helper");
const createNewUser = require("../helpers/createNewUser.helper");
const setUserVerified = require("../helpers/setUserVerified.helper");
const checkPWDvalid = require("../helpers/checkPwd.helper");
const jwt = require("jsonwebtoken");

const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userIDRegex = /^[a-zA-Z0-9._-]+$/;
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function generateToken(userIDorMail) {
  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  const token = jwt.sign({ userIDorMail }, secretKey, { expiresIn: "1h" });
  return token;
}

async function login(req) {
  let { userIDorMail, userPWD } = req.body;

  userIDorMail = userIDorMail.trim();
  userPWD = userPWD.trim();

  const isMail = mailRegex.test(userIDorMail);
  const isUserID = userIDRegex.test(userIDorMail);

  if (!(isMail || isUserID)) {
    return { status: 400, json: "Invalid userID or mail format" };
  }

  const isUserRegistered = await checkUserRegistered(isMail ? null : userIDorMail, isUserID ? null : userIDorMail);

  if (!isUserRegistered) {
    return { status: 400, json: "No user with this name or mail" };
  }

  if (isUserRegistered && !isUserRegistered.verified) {
    return { status: 400, json: "User is registered but not verified" };
  }

  const isPWDValid = await checkPWDvalid(isMail ? null : userIDorMail, isUserID ? null : userIDorMail, userPWD);

  if (isPWDValid) {
    const token = generateToken(isUserRegistered.userID);

    return {
      status: 200,
      json: {
        msg: "Login Success",
        userID: isUserRegistered.userID,
        token: token,
      },
    };
  } else {
    return { status: 400, json: "This password or username is invalid" };
  }
}

async function register(req) {
  let { userMail, userID, userPWD } = req.body;

  if (!userMail || !userID || !userPWD) {
    return { status: 400, json: "Please provide valid values for email, username, and password" };
  }

  userMail = userMail.trim();
  userID = userID.trim();
  userPWD = userPWD.trim();

  if (!mailRegex.test(userMail) || !userIDRegex.test(userID)) {
    return { status: 400, json: "Invalid email or username format" };
  }
  if (!pwdRegex.test(userPWD)) {
    return { status: 400, json: "Please use a strong password" };
  }

  const isUserRegistered = await checkUserRegistered(userID, userMail);

  if (isUserRegistered) {
    return {
      status: 400,
      json: `${
        isUserRegistered.userID === userID ? isUserRegistered.userID : isUserRegistered.userMail
      } already exists`,
    };
  }

  const registerCode = generateCode();
  const emailSent = await sendRegistrationEmail(userID, userMail, registerCode);
  await createNewUser(userID, userMail, userPWD, registerCode);

  return emailSent
    ? { status: 200, json: "Registration email sent successfully" }
    : { status: 500, json: "Failed to send registration email" };
}

async function registerVerify(req) {
  let { userMail, registerCode } = req.body;

  userMail = userMail.trim();
  registerCode = registerCode.trim();

  console.log("verify", userMail, registerCode);

  const isUserVerified = await setUserVerified(userMail, registerCode);

  return isUserVerified ? { status: 200, json: "User verified" } : { status: 400, json: "User not verified" };
}

async function generalAuth(req) {
  const { userIDorMail } = req.user;

  return { status: 200, json: { msg: "Authentication successful", userID: userIDorMail } };
}

module.exports = {
  login,
  register,
  registerVerify,
  generalAuth,
};
