CREATE TABLE users (
  user_id serial PRIMARY KEY,
  auth_id varchar(50) NOT NULL,
  email varchar(255) NOT NULL,
  username varchar(50),
  Gender varchar(50),
  Sexuality varchar(50),
  Age int
);

CREATE TABLE user_questions (
  user_question_id serial PRIMARY KEY,
  user_id int NOT NULL,
  question_id int NOT NULL
);

CREATE TABLE questions (
  question_id serial PRIMARY KEY,
  question varchar(500)
);

CREATE TABLE answers (
  answer_id serial PRIMARY KEY,
  answer varchar(500),
  question_id int NOT NULL
);

ALTER TABLE user_questions ADD CONSTRAINT "User_Question_User_Id_FK" FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE user_questions ADD CONSTRAINT "User_Question_User_Question_Id_FK" FOREIGN KEY (user_question_id) REFERENCES questions (question_id);

ALTER TABLE answers ADD CONSTRAINT "Answer_Question_Id_FK" FOREIGN KEY (question_id) REFERENCES questions (question_id);