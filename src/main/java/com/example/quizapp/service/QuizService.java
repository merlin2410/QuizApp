package com.example.quizapp.service;

import com.example.quizapp.model.Question;
import com.example.quizapp.model.Student;
import com.example.quizapp.model.Submission;
import com.example.quizapp.dto.StudentResult;
import com.example.quizapp.model.*;
import com.example.quizapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private QuizRepository quizRepository;

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    public Optional<Teacher> teacherLogin(String username, String password) {
        Optional<Teacher> teacher = teacherRepository.findByUsername(username);
        if (teacher.isPresent() && teacher.get().getPassword().equals(password)) {
            return teacher;
        }
        return Optional.empty();
    }

    public Optional<Student> login(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber);
    }

    public List<Question> getQuestions() {
        return questionRepository.findAll();
    }

    public void submit(List<Submission> submissions) {
        for (Submission submission : submissions) {
            // Assume the quiz, student, questionId, and selectedOptionId are set on the submission
            Optional<Question> questionOpt = questionRepository.findById(submission.getQuestionId());
            if (questionOpt.isPresent()) {
                Question question = questionOpt.get();
                boolean isCorrect = question.getOptions().stream()
                        .anyMatch(option -> option.getId().equals(submission.getSelectedOptionId()) && option.isCorrect());

                if (isCorrect) {
                    submission.setMarksAwarded(question.getMarks());
                } else {
                    submission.setMarksAwarded(0);
                }
            } else {
                submission.setMarksAwarded(0);
            }
        }
        submissionRepository.saveAll(submissions);
    }

    public List<Submission> getResults() {
        return submissionRepository.findAll();
    }

    public List<StudentResult> getQuizResults(Long quizId) {
        List<Submission> submissions = submissionRepository.findByQuizId(quizId);
        Map<Student, Integer> studentMarks = new HashMap<>();

        for (Submission submission : submissions) {
            studentMarks.merge(submission.getStudent(), submission.getMarksAwarded(), Integer::sum);
        }

        return studentMarks.entrySet().stream()
                .map(entry -> new StudentResult(
                        entry.getKey().getName(),
                        entry.getKey().getRollNumber(),
                        entry.getValue()))
                .collect(Collectors.toList());
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Question addQuestionToQuiz(Long quizId, Question question) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isPresent()) {
            Quiz quiz = quizOpt.get();
            quiz.getQuestions().add(question);
            // To ensure the relationship is set correctly
            if (question.getOptions() != null) {
                question.getOptions().forEach(option -> option.setQuestion(question));
            }
            return questionRepository.save(question);
        } else {
            // Or throw a custom exception
            return null;
        }
    }
}
