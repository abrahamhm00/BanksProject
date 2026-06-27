package edu.upc.upcschool.mortgage.models;

import org.springframework.data.annotation.Id;

public record Bank(@Id Integer id, String name, String bank_code, String url, Integer ownerId) {

}