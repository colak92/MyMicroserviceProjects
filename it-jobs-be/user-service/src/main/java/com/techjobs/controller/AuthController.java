package com.techjobs.controller;

import com.techjobs.config.JwtProvider;
import com.techjobs.dto.AuthResponse;
import com.techjobs.dto.LoginRequest;
import com.techjobs.kafka.event.UserCreatedEvent;
import com.techjobs.kafka.producer.KafkaUserProducerService;
import com.techjobs.model.User;
import com.techjobs.model.UserRole;
import com.techjobs.repository.UserRepository;
import com.techjobs.service.CustomUserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserServiceImpl userDetailsService;

    private final KafkaUserProducerService kafkaUserProducerService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          CustomUserServiceImpl userDetailsService,
                          KafkaUserProducerService kafkaUserProducerService
    ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.kafkaUserProducerService = kafkaUserProducerService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception{

        String email = user.getEmail();
        String password = user.getPassword();
        String fullName = user.getFullName();
        UserRole role = user.getRole();

        User isEmailExists = userRepository.findByEmail(email);

        if (isEmailExists != null){
            throw new Exception("Email is already used by another user");
        }

        // Create new user
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setFullName(fullName);
        createdUser.setRole(role);
        createdUser.setPassword(passwordEncoder.encode(password));
        userRepository.save(createdUser);

        // Prepare event to send to Kafka
        UserCreatedEvent event = new UserCreatedEvent();
        event.setId(createdUser.getId());
        event.setEmail(createdUser.getEmail());
        event.setFullName(createdUser.getFullName());
        event.setRole(createdUser.getRole().name());

        // Publish to Kafka topic "user.created"
        kafkaUserProducerService.sendMessage("user.created", event);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = JwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Registered Successfully");
        authResponse.setStatus(true);

        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody LoginRequest loginRequest) throws Exception {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();

        authResponse.setMessage("Login Success");
        authResponse.setJwt(token);
        authResponse.setStatus(true);

        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password){
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (userDetails == null){
            throw new BadCredentialsException("Invalid username or password");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new BadCredentialsException("Password not match");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}