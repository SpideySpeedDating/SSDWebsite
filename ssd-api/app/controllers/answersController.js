const answersService = require("../services/answersService");
const userQuestionService = require("../services/userQuestionsService");
const usersService = require("../services/usersService");
const questionsService = require("../services/questionsService");
const answers = require("../routes/answers");
const e = require("express");

module.exports = {
    randomUserAnswers: async (req, res) => {
        try {
            const requestBody = req.body;
            if (!requestBody) {
                res.status(400).send({ message: "Bad Request, no body" });
            }

            const user = await usersService.findUserByAuthId(req.authId);

            const gender = (user.gender || "").toLowerCase();
            const sexuality = (user.sexuality || "").toLowerCase();
            let preferredGender = [];
            let preferredSexuality = [];

            if (gender === "male") {
                if (sexuality === "straight") {
                    preferredGender.push("female");
                    preferredSexuality = ["straight", "other"];
                }
                else if (sexuality === "gay") {
                    preferredGender.push("male");
                    preferredSexuality = ["gay", "other"];
                }
                else {
                    preferredGender = ["male", "female"];
                    preferredSexuality = ["straight", "gay", "other"];
                }
            }
            else if (gender === "female") {
                if (sexuality === "straight") {
                    preferredGender.push("male");
                    preferredSexuality = ["straight", "other"];
                }
                else if (sexuality === "gay") {
                    preferredGender.push("female");
                    preferredSexuality = ["gay", "other"];
                }
                else {
                    preferredGende = ["male", "female"];
                    preferredSexuality = ["straight", "gay", "other"];
                }
            }
            else {
                preferredGende = ["other"];
                preferredSexuality = ["straight", "gay", "other"];
            }

            // TODO consider age range

            const users = await usersService.findAllUsersOfGender({ gender: preferredGender, sexuality: preferredSexuality });
            let selectedUsers = users.rows;
            if (users.length >= 8) {
                selectedUsers = getRandomItems(users, 8);
            }

            let randomUserAnswers = [];
            for (let i = 0; i < selectedUsers.length; i++) {
                const userQuestions = await userQuestionService.findAllUserQuestions(selectedUsers[i]);
                userQuestions.sort((a, b) => a.question_id - b.question_id);
                let answers = [];
                if (userQuestions.length > 0) {
                    for (let i = 0; i < userQuestions.length; i++) {
                        const userQuestion = userQuestions[i];
                        const answer = await answersService.findAnswer(userQuestion) || "No answer provided";
                        answers.push(answer);
                    }
                } else {
                    answers = new Array(8).fill({answer: "No answer provided"});
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
            if (!requestBody) {
                res.status(400).send({ message: "Bad Request, no user data" });
            }
            const questionId = requestBody.question_id;
            const answer = requestBody.answer || "No Answer";

            const user = await usersService.findUserByAuthId(authId);
            let userQuestion = await userQuestionService.findUserQuestion({ user_id: user.user_id, question_id: questionId });
            if (!userQuestion) {
                userQuestion = await userQuestionService.createUserQuestion({ user_id: user.user_id, question_id: questionId });
                await answersService.createAnswer({ answer: answer, user_question_id: userQuestion.user_question_id });
            }
            else {
                await answersService.updateAnswer({ answer: answer, user_question_id: userQuestion.user_question_id })
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
            if (!requestBody || !requestBody.question_id) {
                res.status(400).send({ message: "Bad Request, no question id" });
            }

            const questionId = requestBody.question_id;
            const user = await usersService.findUserByAuthId(authId);
            const userQuestion = await userQuestionService.findUserQuestion({ user_id: user.user_id, question_id: questionId });
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