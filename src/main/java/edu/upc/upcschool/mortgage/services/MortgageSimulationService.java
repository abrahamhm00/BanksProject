package edu.upc.upcschool.mortgage.services;

import edu.upc.upcschool.mortgage.models.Mortgage;
import edu.upc.upcschool.mortgage.repositories.MortgageRepository;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;

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

            // 
            return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) -1);
       } catch (NoSuchElementException | IllegalArgumentException e){
            //Rethrow bussines & validation exceptions to Let them propagate, for example, to the controller, correctly.
            throw e;
       } catch (Exception e){
            // catch database errors or other unexpected exceptions and wrap them.
            throw new RuntimeException("Erorr calculating mortgage simulation", e);
       }    
    }
}