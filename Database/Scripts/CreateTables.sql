CREATE TABLE "User" (
  user_id SERIAL PRIMARY KEY,
  auth_id VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(50),
  Gender VARCHAR(50),
  Sexuality VARCHAR(50),
  Age INT
);

CREATE TABLE "UserQuestion" (
  user_question_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  question_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "User"(user_id),
  FOREIGN KEY (question_id) REFERENCES "Question"(question_id)
);

CREATE TABLE "Question" (
  question_id SERIAL PRIMARY KEY,
  question VARCHAR(500),
  answer_id INT NOT NULL,
  FOREIGN KEY (answer_id) REFERENCES "Answer"(answer_id)
);

CREATE TABLE "Answer" (
  answer_id SERIAL PRIMARY KEY,
  answer VARCHAR(500)
);
