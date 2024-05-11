const questionsService = require("../services/questionsService");

module.exports = {
    findAllQuestions: async (req, res) => {
        try {
            const questions = await questionsService.findAllQuestions();

            return res.status(200).send(questions);
        }
        catch (error) {
            return res.status(500).send({ message: error });
        }
    }
};
