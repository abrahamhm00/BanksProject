package edu.upc.upcschool.mortgage.models;

import org.springframework.data.annotation.Id;
import java.math.BigDecimal;

public record Mortgage(@Id Integer id, String name, String type, String description, BigDecimal TAE) {

}
