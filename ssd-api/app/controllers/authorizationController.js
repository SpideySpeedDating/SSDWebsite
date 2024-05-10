const middleware = require('../middleware/verify');
const usersService = require("../services/usersService");

async function auth(req, res) {
  var authorization = req.headers.authorization;
  
  console.log(authorization)
  if (!authorization) {
    return res.status(401).send({ message: 'no code' });
  }
  const code = authorization.split(' ')[1];
  const access_token = await middleware.exchangeCodeForAccessToken(code);
  if(!access_token)
  {
    return res.status(401).send({ message: 'no access token' });
  }

  const userData = await middleware.getGitHubUserData(access_token);
  const authId = userData.userId;
  const userEmail = userData.userEmail;

  const user = await usersService.findUserByAuthId(authId);
  if (!user){
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
  res.send(middleware.createJWT({
    access_token: access_token,
    authId: authId,
    email: userEmail
  }));
}

module.exports = {
  auth
};
