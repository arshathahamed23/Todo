package dev.coder.TodoApp.repository;

import dev.coder.TodoApp.models.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

// CRUD Create, Read, Update, Delete
public interface TodoRepository extends JpaRepository<Todo, Long> {

}
