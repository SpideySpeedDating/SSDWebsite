CREATE TABLE "User" (
  "user_id" serial PRIMARY KEY,
  "auth_id" varchar(50) NOT NULL,
  "email" varchar(255) NOT NULL,
  "username" varchar(50),
  "Gender" varchar(50),
  "Sexuality" varchar(50),
  "Age" int
);

CREATE TABLE "UserQuestion" (
  "user_question_id" serial PRIMARY KEY,
  "user_id" int NOT NULL,
  "question_id" int NOT NULL
);

CREATE TABLE "Question" (
  "question_id" serial PRIMARY KEY,
  "question" varchar(500)
);

CREATE TABLE "Answer" (
  "answer_id" serial PRIMARY KEY,
  "answer" varchar(500),
  "question_id" int NOT NULL
);

ALTER TABLE "UserQuestion" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("user_id");

ALTER TABLE "UserQuestion" ADD FOREIGN KEY ("user_question_id") REFERENCES "Question" ("question_id");

ALTER TABLE "Answer" ADD FOREIGN KEY ("question_id") REFERENCES "Question" ("question_id");
