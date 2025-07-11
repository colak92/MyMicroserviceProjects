package com.techjobs.kafka.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicantUserCreatedEvent {
    private Long id;
    private String email;
    private String role;
    private String fullName;
}
