function calculateCarboncredits(num_req, data){
    const data_bytes = data;
    const data_bits = data_bytes * 8;
    const energy_consumption = data_bits * 0.001;
    const carbon_credits =  energy_consumption * 0.5;
    console.log(carbon_credits);
    return carbon_credits;
}

module.exports = calculateCarboncredits;