ALTER TABLE answers DROP CONSTRAINT "Answer_Question_Id_FK";
ALTER TABLE answers ADD CONSTRAINT "Answer_User_Question_Id_FK" FOREIGN KEY (question_id) REFERENCES user_questions (user_question_id);

ALTER TABLE user_questions DROP CONSTRAINT "User_Question_User_Question_Id_FK";
ALTER TABLE user_questions ADD CONSTRAINT "User_Question_Question_Id_FK" FOREIGN KEY (question_id) REFERENCES questions (question_id);