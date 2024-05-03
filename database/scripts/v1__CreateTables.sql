CREATE TABLE user (
  user_id serial PRIMARY KEY,
  auth_id varchar(50) NOT NULL,
  email varchar(255) NOT NULL,
  username varchar(50),
  Gender varchar(50),
  Sexuality varchar(50),
  Age int
);

CREATE TABLE userquestion (
  user_question_id serial PRIMARY KEY,
  user_id int NOT NULL,
  question_id int NOT NULL
);

CREATE TABLE question (
  question_id serial PRIMARY KEY,
  question varchar(50)
);

CREATE TABLE answer (
  answer_id serial PRIMARY KEY,
  answer varchar(50),
  question_id int NOT NULL
);

ALTER TABLE userquestion ADD FOREIGN KEY (user_id) REFERENCES user (user_id);

ALTER TABLE userquestion ADD FOREIGN KEY (user_question_id) REFERENCES question (question_id);

ALTER TABLE answer ADD FOREIGN KEY (question_id) REFERENCES question (question_id);
