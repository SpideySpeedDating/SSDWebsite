const usersService = require("../services/usersService");

module.exports = {
    createUser: async (req, res) => {
        try{
            const authId = req.authId;
            const responseBody = req.body;

            const createdUser = await usersService.createUser(
                authId, 
                { 
                    email: responseBody.email,
                    username: responseBody.username,
                    gender: responseBody.gender,
                    sexuality: responseBody.sexuality,
                    age: responseBody.age
                });

            return res.status(200).send(createdUser);
        }
        catch (error){
            console.error(error);
            return res.status(500).send(error.message);
        }
    },
    findAllUsers: async (req, res) => {
        try {
            const allUsers = await usersService.findAllUsers();

            return res.status(200).send(allUsers);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
    },
    findUserByAuthId: async (req, res) => {
        try{
            const authId = req.authId;
            const user = await usersService.findUserByAuthId(authId);
            console.log("user:" + user);

            return res.status(200).send(user);
        }
        catch (error){
            console.error(error);
            return res.status(500).send(error.message);
        }
    },
    updateUser: async (req, res) => {
        try{
            const authId = req.authId;
            const responseBody = req.body;
            const updatedUser = await usersService.updateUser(
                authId, 
                { 
                    email: responseBody.email,
                    username: responseBody.username,
                    gender: responseBody.gender,
                    sexuality: responseBody.sexuality,
                    age: responseBody.age
                });

            return res.status(200).send(updatedUser);
        }
        catch (error){
            console.error(error);
            return res.status(500).send(error.message);
        }
    }
};
