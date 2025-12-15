package dev.coder.TodoApp.controller;

import dev.coder.TodoApp.service.TodoService;
import dev.coder.TodoApp.models.Todo;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo")
public class TodoController {
    @Autowired
    private TodoService todoService;

    // Path Variable
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo Retrieved Successfully"),
            @ApiResponse(responseCode = "404", description = "Todo was not Found")
    })
    @GetMapping("/{id}")
    ResponseEntity<Todo> getToDoById(@PathVariable long id) {
        try {
            Todo createdTodo = todoService.getTodoById(id);
            return new ResponseEntity<>(createdTodo, HttpStatus.OK);
        } catch (RuntimeException exception) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    ResponseEntity<List<Todo>> getTodos() {
        return new ResponseEntity<List<Todo>>(todoService.getTodos(), HttpStatus.OK);
    }

    @GetMapping("/page")
    ResponseEntity<Page<Todo>> getAllTodosPage(@RequestParam int page, @RequestParam int size) {
        return new ResponseEntity<>(todoService.getAllTodosPage(page, size), HttpStatus.OK);
    }

    // Request Body
    @PostMapping("/create")
    ResponseEntity<Todo> createUser(@Valid @RequestBody Todo todo) {
        Todo createdTodo = todoService.createTodo(todo);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }

    // Update
    @PutMapping
    ResponseEntity<Todo> updateToDoById(@RequestBody Todo todo) {
        return new ResponseEntity<>(todoService.updateTodo(todo), HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodoById(id);
        return ResponseEntity.noContent().build(); // 204
    }

}
