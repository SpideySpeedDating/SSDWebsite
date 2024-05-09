const middleware = require('../middleware/verify');
const usersService = require("../services/usersService");

async function auth(req, res) {
  var authorization = req.headers.authorization;
  
  console.log(authorization)
  if (!authorization) {
    return res.status(401).send({ message: 'no token' });
  }

  const access_token = authorization.split(' ')[1];
  const userData = await middleware.getGitHubUserData(access_token);
                                      // .then(userInfo => {
                                      //     console.log('User ID:', userInfo.userId);
                                      //     console.log('User Email:', userInfo.userEmail);
                                      // })
                                      // .catch(error => {
                                      //     console.error(error);
                                      // });
  
  const authId = userData.userId;
  const userEmail = userData.userEmail;

  console.log('User ID:', authId);
  console.log('User Email:', userEmail);

  const user = await usersService.findUserByAuthId(authId);
  console.log(user);
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
    
      console.log("What.");
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
