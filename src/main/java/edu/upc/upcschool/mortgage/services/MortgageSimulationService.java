package edu.upc.upcschool.mortgage.services;

import edup.upcschool.mortgage.models.Mortgage;
import edu.upc.upcschool.mortgage.repositories.MortgageRepository;
import org.springframework.stereotype.Service;

@Service
public class MortgageSimulationService {

    private MortgageRepository mortgageRepository;

    public class MortgageSimulationService(
    mortgageRepository mortgageRepository)
    {
            this.mortgageRepository = mortgageRepository;
        }

    /**
     * Calculation of the mensual fee
     */
    public double simulate(Integer bankId,Integer mortgageId, double principal, int years){
        Mortgage mortgage = mortgageRepository;
        
        if(!findByIdAndBankId(mortgageId, bankId)){
            return 
        }

    }
}