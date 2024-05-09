const answersService = require('../services/answersService');
const userQuestionService = require('../services/userQuestionsService');
const usersService = require('../services/usersService');

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
    },
    createAnswer: async (req, res) => {
        try {
            const authId = req.authId;
            const questionId = req.body.question_id;
            const answer = req.body.answer;
            
            const user = await usersService.findUserByAuthId(authId);
            const userQuestion = await userQuestionService.createUserQuestion({user_id: user.user_id, question_id: questionId});
            const newAnswer = await answersService.createAnswer({answer: answer, user_question_id: userQuestion.user_question_id});
            
            return res.status(200).send("success");
        }
        catch (error) {
            return res.status(500).send(error);
        }
    },
    findAllUsersAnswers: async (req, res) => {
        try {
            const authId = req.authId;
            console.log("authId" + authId);

            const user = await usersService.findUserByAuthId(authId);
            const userQuestions = await userQuestionService.findAllUserQuestions(user);
            console.log("userQuestions" + userQuestions);

            const answers = [];

            for (let i = 0; i < userQuestions.length; i++) {
                const userQuestion = userQuestions[i];
                const answer = await answersService.findAnswer(userQuestion);
                console.log({ question_id: userQuestion.question_id, answer: answer.answer });
                answers.push({ question_id: userQuestion.question_id, answer: answer.answer });
                }
                  
            
            console.log("answers: " + answers[0]);
            return res.send(answers);
        }
        catch (err) {
            return res.status(500).send(err);
        }
    },
    findUserAnswer: async (req, res) => {
        try {
            const authId = req.authId;
            const questionId = req.question_id;

            const user = await usersService.findUserByAuthId(authId);
            console.log("user: " + user);
            const userQuestion = await userQuestionService.findUserQuestion({user_id: user.user_id, question_id: questionId});
            console.log("userQuestion: " + userQuestion);
            const answer = await answersService.findAnswer(userQuestion);
            console.log("answer: " + answer);

            return res.send(answer);
        }
        catch (err) {
            return res.status(500).send(err);
        }
    }
};