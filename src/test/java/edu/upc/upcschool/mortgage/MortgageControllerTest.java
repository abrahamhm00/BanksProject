package edu.upc.upcschool.mortgage;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.upc.upcschool.mortgage.models.Mortgage;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MortgageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldUpdateAnExistenceMortgage() throws Exception {
        Mortgage mortgageToUpdate = new Mortgage(
                1,
                1,
                "Fixed Mortgage Updated",
                "FIXED",
                "New description with ObjectMapper",
                new BigDecimal(2.50));
        String jsonPayload = objectMapper.writeValueAsString(mortgageToUpdate);

        mockMvc.perform(put("/banks/1/mortgages/1")
                .header("ApiKey", "key-alice-1234")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fixed Mortgage Updated"))
                .andExpect(jsonPath("$.TAE").value(2.50));
    }

    @Test
    void shouldReturnForbiddenWhenUserIsNotOwner() throws Exception {
        Mortgage mortgageToUpdate = new Mortgage(
                1,
                1,
                "Unauthorized Edit Attempt",
                "FIXED",
                "Malicious modification attempt",
                new BigDecimal(9.99));
        String jsonPayload = objectMapper.writeValueAsString(mortgageToUpdate);

        mockMvc.perform(put("/banks/1/mortgages/1")
                .header("ApiKey", "key-bob-5678") // Bob is NOT the owner of Bank 1
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnNotFoundWhenMortgageDoesNotExist() throws Exception {
        Mortgage mortgageToUpdate = new Mortgage(
                999,
                1,
                "Ghost Mortgage",
                "VARIABLE",
                "This mortgage does not exist in the database",
                new BigDecimal(3.00));
        String jsonPayload = objectMapper.writeValueAsString(mortgageToUpdate);

        mockMvc.perform(put("/banks/1/mortgages/999") // Mortgage 999 does not exist
                .header("ApiKey", "key-alice-1234") // Alice is the owner of Bank 1 (passes security)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isNotFound());
    }
}
