package com.example.quizapp.dto;

public class StudentResult {

    private String studentName;
    private String rollNumber;
    private int totalMarks;

    public StudentResult(String studentName, String rollNumber, int totalMarks) {
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.totalMarks = totalMarks;
    }

    // Getters and setters
    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }
}
