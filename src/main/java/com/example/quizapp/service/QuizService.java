package com.example.quizapp.service;

import com.example.quizapp.model.Question;
import com.example.quizapp.model.Student;
import com.example.quizapp.model.Submission;
import com.example.quizapp.repository.QuestionRepository;
import com.example.quizapp.repository.StudentRepository;
import com.example.quizapp.repository.SubmissionRepository;
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
}
