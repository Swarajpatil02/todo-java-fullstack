package com.taskflow.todo.service;

import com.taskflow.todo.dto.TaskRequest;
import com.taskflow.todo.model.Task;
import com.taskflow.todo.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Task getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));
    }

    public Task create(TaskRequest request) {
        Task task = new Task(request.getTitle().trim(), cleanDescription(request.getDescription()));
        return repository.save(task);
    }

    public Task update(Long id, TaskRequest request) {
        Task task = getById(id);
        task.setTitle(request.getTitle().trim());
        task.setDescription(cleanDescription(request.getDescription()));
        return repository.save(task);
    }

    public Task toggle(Long id) {
        Task task = getById(id);
        task.setCompleted(!task.isCompleted());
        return repository.save(task);
    }

    public void delete(Long id) {
        Task task = getById(id);
        repository.delete(task);
    }

    private String cleanDescription(String description) {
        if (description == null || description.isBlank()) return null;
        return description.trim();
    }
}
