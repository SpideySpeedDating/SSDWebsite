ALTER TABLE answers DROP CONSTRAINT "Answer_Question_Id_FK";
ALTER TABLE answers ADD CONSTRAINT "Answer_User_Question_Id_FK" FOREIGN KEY (question_id) REFERENCES user_questions (user_question_id);
