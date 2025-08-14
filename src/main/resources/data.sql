-- Insert students
INSERT INTO student (name, roll_number) VALUES ('Arun Kumar', '101');
INSERT INTO student (name, roll_number) VALUES ('Meera Nair', '102');

-- Insert questions
-- H2 will auto-increment IDs starting from 1
INSERT INTO question (question_text) VALUES ('What is the capital of France?');
INSERT INTO question (question_text) VALUES ('What is the chemical symbol for water?');

-- Insert options for question 1
INSERT INTO quiz_option (option_text, is_correct, question_id) VALUES ('Paris', true, 1);
INSERT INTO quiz_option (option_text, is_correct, question_id) VALUES ('London', false, 1);
INSERT INTO quiz_option (option_text, is_correct, question_id) VALUES ('Berlin', false, 1);

-- Insert options for question 2
INSERT INTO quiz_option (option_text, is_correct, question_id) VALUES ('H2O', true, 2);
INSERT INTO quiz_option (option_text, is_correct, question_id) VALUES ('CO2', false, 2);
INSERT INTO quiz_option (option_text, is_correct, question_id) VALUES ('NaCl', false, 2);

-- Insert a default teacher (password is 'password')
-- In a real application, you would use a hashed password.
INSERT INTO teacher (username, password) VALUES ('admin', 'password');
