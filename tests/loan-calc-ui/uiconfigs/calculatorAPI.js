const { request } = require('@playwright/test');

function conclusionFeeCalc(amount) {
  if (amount <= 2250) {
    return 45; 
  } else {
    return 45 + (amount - 2250) * 0.02;
  }
}


async function sendApiRequest(page, amount, conclusionFee, period) {
  const requestBody = {
    currency: 'EUR', //doesn't change?
    productType: 'SMALL_LOAN_EE01', //doesn't change?
    maturity: period,
    administrationFee: 3.99, //doesn't change?
    conclusionFee: conclusionFee,
    amount: amount,
    monthlyPaymentDay: 15, //doesn't change?
    interestRate: 16.8 //doesn't change?
  };

  const response = await page.request.post('https://taotlus.bigbank.ee/api/v1/loan/calculate', {
    data: requestBody
  });

  const responseBody = await response.json();
  return responseBody;
}

module.exports = {
  conclusionFeeCalc,
  sendApiRequest,
};
