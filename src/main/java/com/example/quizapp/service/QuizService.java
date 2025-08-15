package com.example.quizapp.service;

import com.example.quizapp.model.Question;
import com.example.quizapp.model.Student;
import com.example.quizapp.model.Submission;
import com.example.quizapp.model.Teacher;
import com.example.quizapp.repository.QuestionRepository;
import com.example.quizapp.repository.StudentRepository;
import com.example.quizapp.repository.SubmissionRepository;
import com.example.quizapp.repository.TeacherRepository;
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
        submissionRepository.saveAll(submissions);
    }

    public List<Submission> getResults() {
        return submissionRepository.findAll();
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Question addQuestion(Question question) {
        // To ensure the relationship is set correctly
        if (question.getOptions() != null) {
            question.getOptions().forEach(option -> option.setQuestion(question));
        }
        return questionRepository.save(question);
    }
}
