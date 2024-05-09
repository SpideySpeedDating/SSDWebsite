const questionsService = require('../services/questionsService');

module.exports = {
    findAllQuestions: async (req, res) => {
        try {
            const questions = await questionsService.findAllQuestions();

            return res.send(questions);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
    }
};
