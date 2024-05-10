const answersService = require('../services/answersService');
const userQuestionService = require('../services/userQuestionsService');
const usersService = require('../services/usersService');
const questionsService = require('../services/questionsService');
const answers = require('../routes/answers');

module.exports = {
    randomUserAnswers: async (req, res) => {
        try {
            const questions = await questionsService.findAllQuestions();
            const users = await usersService.findAllUsers();

            const randomUserAnswers = [];

            let selectedUsers = users;
            if (users.length >= 8){
                selectedUsers = getRandomItems(users, 8);
            }
            
            for (let i = 0; i < selectedUsers.length; i++) {
                const userQuestions = await userQuestionService.findAllUserQuestions({user_id: selectedUsers[i].user_id});
                const answers = [];
                if (userQuestions){
                    for (let i = 0; i < userQuestions.length; i++){
                        const userQuestion = userQuestions[i];
                        let answer = await answersService.findAnswer(userQuestion);
    
                        if (!answer){
                            answer = "No answer provided";
                        }
                        answers.push(answer);
                    }
                }

                randomUserAnswers.push({ 
                    email: selectedUsers[i].email,
                    answers: answers
                })
            }

            return res.send(randomUserAnswers);
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

            const user = await usersService.findUserByAuthId(authId);
            const userQuestions = await userQuestionService.findAllUserQuestions(user);

            const answers = [];

            for (let i = 0; i < userQuestions.length; i++) {
                const userQuestion = userQuestions[i];
                const answer = await answersService.findAnswer(userQuestion);
                answers.push({ question_id: userQuestion.question_id, answer: answer.answer });
                }
                  
            return res.send(answers);
        }
        catch (err) {
            return res.status(500).send(err);
        }
    },
    findUserAnswer: async (req, res) => {
        try {
            const authId = req.authId;
            const questionId = req.body.question_id;

            const user = await usersService.findUserByAuthId(authId);
            const userQuestion = await userQuestionService.findUserQuestion({user_id: user.user_id, question_id: questionId});
            const answer = await answersService.findAnswer(userQuestion);

            return res.send(answer);
        }
        catch (err) {
            return res.status(500).send(err);
        }
    }
};

function getRandomItems(list, numItems) {
    const shuffledList = list.slice();
    let currentIndex = shuffledList.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        temporaryValue = shuffledList[currentIndex];
        shuffledList[currentIndex] = shuffledList[randomIndex];
        shuffledList[randomIndex] = temporaryValue;
    }

    return shuffledList.slice(0, numItems);
}