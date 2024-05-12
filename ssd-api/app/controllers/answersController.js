const answersService = require("../services/answersService");
const userQuestionService = require("../services/userQuestionsService");
const usersService = require("../services/usersService");
const questionsService = require("../services/questionsService");
const answers = require("../routes/answers");

module.exports = {
    randomUserAnswers: async (req, res) => {
        try {
            const requestBody = req.body;
            if (!requestBody){
                res.status(400).send({ message: "Bad Request, no body" });
            }

            const gender = (requestBody.gender || "").toLowerCase();
            const orientation = (requestBody.sexuality || "").toLowerCase();
            let preferredGender;
            if (gender === "male") {
                preferredGender = (orientation === "straight") ? "female" : "male";
            } else {
                preferredGender = (orientation === "straight") ? "male" : "female";
            }

            // TODO consider age range

            const users = await usersService.findAllUsersOfGender(preferredGender);
            let selectedUsers = users;
            if (users.length >= 8){
                selectedUsers = getRandomItems(users, 8);
            }
            
            let randomUserAnswers = [];
            for (let i = 0; i < selectedUsers.length; i++) {
                const userQuestions = await userQuestionService.findAllUserQuestions(selectedUsers[i]);
                userQuestions.sort((a, b) => a.question_id - b.question_id);
                const answers = [];
                if (userQuestions){
                    for (let i = 0; i < userQuestions.length; i++){
                        const userQuestion = userQuestions[i];
                        const answer = await answersService.findAnswer(userQuestion) || "No answer provided";
                        answers.push(answer);
                    }
                }

                randomUserAnswers.push({ 
                    email: selectedUsers[i].email,
                    answers: answers
                })
            }

            return res.status(200).send(randomUserAnswers);
        }
        catch (error) {
            return res.status(500).send(error.message);
        }
    },
    createAnswer: async (req, res) => {
        try {
            const authId = req.authId;
            const requestBody = req.body;
            if (!requestBody){
                res.status(400).send({ message: "Bad Request, no user data" });
            }
            const questionId = requestBody.question_id;
            const answer = requestBody.answer || "No Answer";
            
            const user = await usersService.findUserByAuthId(authId);
            let  userQuestion = await userQuestionService.findUserQuestion({user_id: user.user_id, questionId});
            if (!userQuestion){
                userQuestion = await userQuestionService.createUserQuestion({user_id: user.user_id, question_id: questionId});
                answersService.updateAnswer({answer: answer, user_question_id: userQuestion.user_question_id})
            }
            else{
                await answersService.createAnswer({answer: answer, user_question_id: userQuestion.user_question_id});
            }
            
            return res.status(200).send({ message: "Success" });
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
                const answer = await answersService.findAnswer(userQuestions[i]);
                answers.push({ question_id: userQuestion.question_id, answer: answer.answer }); // Should have added question_number to table
                }

            return res.status(200).send(answers);
        }
        catch (error) {
            return res.status(500).send(error);
        }
    },
    findUserAnswer: async (req, res) => {
        try {
            const authId = req.authId;
            const requestBody = req.body;
            if (!requestBody || !requestBody.question_id){
                res.status(400).send({ message: "Bad Request, no question id" });
            }

            const questionId = requestBody.question_id;
            const user = await usersService.findUserByAuthId(authId);
            const userQuestion = await userQuestionService.findUserQuestion({user_id: user.user_id, question_id: questionId});
            const answer = await answersService.findAnswer(userQuestion);

            return res.status(200).send(answer);
        }
        catch (error) {
            return res.status(500).send(error);
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