package com.example.quizapp.controller;

import com.example.quizapp.model.Question;
import com.example.quizapp.model.Student;
import com.example.quizapp.model.Submission;
import com.example.quizapp.model.Teacher;
import com.example.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/teacher/login")
    public ResponseEntity<Teacher> teacherLogin(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        Optional<Teacher> teacher = quizService.teacherLogin(username, password);
        return teacher.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/login")
    public ResponseEntity<Student> login(@RequestBody Map<String, String> payload) {
        String rollNumber = payload.get("rollNumber");
        Optional<Student> student = quizService.login(rollNumber);
        return student.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @GetMapping("/questions")
    public List<Question> getQuestions() {
        return quizService.getQuestions();
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submit(@RequestBody List<Submission> submissions) {
        quizService.submit(submissions);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/results")
    public List<Submission> getResults() {
        return quizService.getResults();
    }

    @PostMapping("/students")
    public Student addStudent(@RequestBody Student student) {
        return quizService.addStudent(student);
    }
}
