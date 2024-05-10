const https = require("https");
const jwt = require("jsonwebtoken");

function ensureAuthenticated(req, res, next) {
  const jwttoken = req.headers.authorization;
  if (!jwttoken) {
    return res.status(400).json({ message: "Bad Request, no token" });
  }
  jwt.verify(jwttoken, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
    req.authId = decoded.authId;
    next();
  });
}

async function getGitHubUserData(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: "/user",
      method: "GET",
      headers: {
        "Authorization": `token ${accessToken}`,
        "User-Agent": "Node.js"
      }
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const userData = JSON.parse(data);
            const userId = userData.id;
            const userEmail = userData.email || "Email not available";
            resolve({ userId, userEmail });
          } catch (error) {
            reject(new Error(`Error parsing response data: ${error.message}`));
          }
        } else {
          reject(new Error(`Failed to fetch GitHub user data: ${res.statusCode} - ${res.statusMessage}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Failed to fetch GitHub user data: ${error.message}`));
    });

    req.end();
  });
}

function createJWT(githubResponse) {
  const access_token = githubResponse.authId
  const authId = githubResponse.authId;

  const payload = {
    access_token: access_token,
    authId: authId
  };

  const secretKey = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };

  const jwttoken = jwt.sign(payload, secretKey, options);

  return jwttoken;
}

async function exchangeCodeForAccessToken(code) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  console.log(clientId);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "github.com",
      path: `/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    };

    const req = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const responseData = JSON.parse(data);
        const accessToken = responseData.access_token;
        resolve(accessToken);
      });
    });

    req.on("error", (error) => {
      console.error(error);
      res.status(500).send("Failed to retrieve access token");
    });

    req.end();
  });
}

module.exports = {
  ensureAuthenticated,
  createJWT,
  getGitHubUserData,
  exchangeCodeForAccessToken
};
