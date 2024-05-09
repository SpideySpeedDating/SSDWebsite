const AnswerModel = {
    answer_id: 'SERIAL PRIMARY KEY',
    answer: 'VARCHAR(500)',
    user_question_id: 'INTEGER NOT NULL REFERENCES questions(question_id)'
  };