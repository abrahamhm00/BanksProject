package edu.upc.upcschool.mortgage.services;

import edu.upc.upcschool.mortgage.models.Mortgage;
import edu.upc.upcschool.mortgage.repositories.MortgageRepository;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;
import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.io.ByteArrayOutputStream;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.Element;

@Service
public class MortgageSimulationService {

    private final MortgageRepository mortgageRepository;

    public MortgageSimulationService(
    MortgageRepository mortgageRepository)
    {
            this.mortgageRepository = mortgageRepository;
        }

    /**
     * Calculation of the monthly fee
     */
    public double simulate(Integer bankId,Integer mortgageId, double principal, int years){
       
       try{
            /**
            * Fetch from repository or throw an exception if not found.
            * */ 
            Mortgage mortgage = mortgageRepository.findByIdAndBankId(mortgageId, bankId).orElseThrow(()-> new NoSuchElementException("Mortgage not found with ID = " + mortgageId + " for bank " + bankId));

            //Validate input parameters
            if(principal <= 0 || years <= 0){
                throw new IllegalArgumentException("Principal and years must be greater than zero.");
            }

            // Calculate standard amortization
            double annualRate = mortgage.TAE().doubleValue() / 100;
            double monthlyRate = annualRate / 12.0;
            int totalMonths = years * 12;

            // Maybe the fees are 0, so a natural division works.
            if(monthlyRate == 0){
                return principal / totalMonths;
            }

            // Fixed the formula: Cuota = (P * i * (1+i)^n) / ((1+i)^n - 1)
            double mathPow = Math.pow(1 + monthlyRate, totalMonths);
            return (principal * monthlyRate * mathPow) / (mathPow - 1);
       } catch (NoSuchElementException | IllegalArgumentException e){
            //Rethrow bussines & validation exceptions to Let them propagate, for example, to the controller, correctly.
            throw e;
       } catch (Exception e){
            // catch database errors or other unexpected exceptions and wrap them.
            throw new RuntimeException("Erorr calculating mortgage simulation", e);
       }    
    }

    /**
     * Generates a month-by-month amortization schedule (French system).
     */
    public List<edu.upc.upcschool.mortgage.models.AmortizationRow> generateAmortizationSchedule(Integer bankId, Integer mortgageId, double principal, int years) {
        double monthlyFee = simulate(bankId, mortgageId, principal, years);
        
        Mortgage mortgage = mortgageRepository.findByIdAndBankId(mortgageId, bankId).orElseThrow();
        double annualRate = mortgage.TAE().doubleValue() / 100;
        double monthlyRate = annualRate / 12.0;
        int totalMonths = years * 12;

        List<edu.upc.upcschool.mortgage.models.AmortizationRow> schedule = new ArrayList<>();
        double pendingCapital = principal;

        for (int month = 1; month <= totalMonths; month++) {
            double interestPayment = pendingCapital * monthlyRate;
            double principalPayment = monthlyFee - interestPayment;
            
            // If it's the very last month, adjust rounding differences
            if (month == totalMonths) {
                principalPayment = pendingCapital;
            }
            
            pendingCapital -= principalPayment;
            if (pendingCapital < 0) pendingCapital = 0;

            schedule.add(new edu.upc.upcschool.mortgage.models.AmortizationRow(
                month,
                BigDecimal.valueOf(interestPayment).setScale(2, RoundingMode.HALF_UP),
                BigDecimal.valueOf(principalPayment).setScale(2, RoundingMode.HALF_UP),
                BigDecimal.valueOf(pendingCapital).setScale(2, RoundingMode.HALF_UP)
            ));
        }
        return schedule;
    }

    /**
     * Generates a PDF document with the amortization schedule.
     */
    public byte[] generateAmortizationPdf(Integer bankId, Integer mortgageId, double principal, int years) {
        List<edu.upc.upcschool.mortgage.models.AmortizationRow> schedule = generateAmortizationSchedule(bankId, mortgageId, principal, years);
        Mortgage mortgage = mortgageRepository.findByIdAndBankId(mortgageId, bankId).orElseThrow();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Add Title
            Paragraph title = new Paragraph("Amortization Schedule: " + mortgage.name());
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20f);
            document.add(title);

            // Add parameters
            document.add(new Paragraph("Requested Capital (Principal): " + principal + " €"));
            document.add(new Paragraph("Duration: " + years + " years"));
            document.add(new Paragraph("TAE: " + mortgage.TAE() + " %"));
            document.add(new Paragraph(" "));

            // Add Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            
            table.addCell("Month");
            table.addCell("Interest Payment (€)");
            table.addCell("Principal Amortization (€)");
            table.addCell("Pending Capital (€)");

            for (edu.upc.upcschool.mortgage.models.AmortizationRow row : schedule) {
                table.addCell(String.valueOf(row.month()));
                table.addCell(row.interestPayment().toString());
                table.addCell(row.principalPayment().toString());
                table.addCell(row.pendingCapital().toString());
            }

            document.add(table);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}