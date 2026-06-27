package edu.upc.upcschool.mortgage.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("ENDUSER")
public record User(

        @Id Integer id,
        String username,
        String apiKey) {
}
