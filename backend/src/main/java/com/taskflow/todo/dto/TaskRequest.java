package com.taskflow.todo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TaskRequest {
    @NotBlank(message = "Title is required.")
    @Size(max = 120, message = "Title must be 120 characters or fewer.")
    private String title;

    @Size(max = 1000, message = "Description must be 1000 characters or fewer.")
    private String description;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
