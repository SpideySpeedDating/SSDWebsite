const middleware = require("../middleware/verify");
const usersService = require("../services/usersService");
const jwt = require("jsonwebtoken");

async function authenticateUser(req, res) {
  const githubCode = req.headers.authorization;
  if (!githubCode) {
    return res.status(400).send({ message: "Bad Request, no code" });
  }

  const access_token = await middleware.exchangeCodeForAccessToken(githubCode);
  if (!access_token) {
    return res.status(400).send({ message: "Bad Request, invalid code" });
  }

  const userData = await middleware.getGitHubUserData(access_token);
  if (!userData) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
  const authId = userData.userId;
  const userEmail = userData.userEmail;

  const user = await usersService.findUserByAuthId(authId);
  if (!user) {
    await usersService.createUser(
      authId,
      {
        email: userEmail,
        username: null,
        gender: null,
        sexuality: null,
        age: null
      });
  }

  const JWT = middleware.createJWT({
    access_token: access_token,
    authId: authId,
    email: userEmail
  });

  res.status(200).json({ message: "Authentication successful", "jwt": JWT });
}

function validateLogin(req, res) {
  const JWT = req.headers.authorization;
  if (!JWT) {
    return res.status(400).send({ message: "Bad Request" });
  }
  jwt.verify(JWT, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
    res.status(200).send({ message: "Valid Token" })
  });
}

function generateLink(_, res) {
  return res.status(200).send({url: `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`})
}

module.exports = {
  authenticateUser,
  validateLogin,
  generateLink
};
