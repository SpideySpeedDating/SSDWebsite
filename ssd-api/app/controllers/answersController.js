// const questionsService = require('../services/questionsService');
const answersService = require('../services/answersService');
const userQuestionService = require('../services/userQuestionsService');
const usersService = require('../services/usersService');

module.exports = {
    createAnswer: async (req, res) => {
        try {
            const authId = req.authId;
            const questionId = req.questionId;
            const answer = req.answer;
            
            const user = usersService.findUserByAuthId(authId);
            const userQuestion = userQuestionService.createUserQuestion({user_id: user.user_id, question_id: questionId})
            answersService.createAnswer({answer: answer, user_question_id: userQuestion.user_question_id})
            
            return res.status(200).send("success");
        }
        catch (err) {
            return res.status(500).send(err);
        }
    },
    findAllUserAnswers: async (req, res) => {
        try {
            const authId = req.authId;
            const questionId = req.questionId;

            const user = usersService.findUserByAuthId(authId);
            const userQuestion = userQuestionService.findUserQuestion({user_id: user.user_id, question_id: questionId});
            answersService.findAnswer(userQuestion);

            return res.send("teapot");
        }
        catch (err) {
            return res.status(500).send(err);
        }
    }
};