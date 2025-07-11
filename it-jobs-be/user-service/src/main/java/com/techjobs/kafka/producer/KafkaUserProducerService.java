package com.techjobs.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaUserProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaUserProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, Object message) {
        kafkaTemplate.send(topic, message);
        System.out.println("Published to topic: " + topic);
    }
}