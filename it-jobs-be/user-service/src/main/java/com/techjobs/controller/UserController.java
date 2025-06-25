package com.techjobs.controller;

import com.techjobs.model.User;
import com.techjobs.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt){
        User user = userService.getUserProfile(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<User>> getUsers(@RequestHeader("Authorization") String jwt){
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}
