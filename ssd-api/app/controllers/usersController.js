const usersService = require("../services/usersService");

module.exports = {
    findUserByAuthId: async (req, res) => {
        const authId = req.authId;
        const user = await usersService.findUserByAuthId(authId);

        if (!user) {
            return res.status(500).send({ message: "Internal Server Error" });
        }

        return res.status(200).send(user);
    },
    updateUser: async (req, res) => {
        try {
            const authId = req.authId;
            const requestBody = req.body;
            if (!requestBody) {
                return res.status(400).send({ message: "Bad Request, no user data" });
            }
            const userEmail = requestBody.email || "Email not available";
            const gender =  (requestBody.gender || "").toLowerCase();
            const sexuality =  (requestBody.sexuality || "").toLowerCase();
            await usersService.updateUser(
                authId,
                {
                    email: userEmail,
                    username: requestBody.username,
                    gender: gender,
                    sexuality: sexuality,
                    age: requestBody.age
                });

            return res.status(200).send({ message: "Success" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
    }
};
