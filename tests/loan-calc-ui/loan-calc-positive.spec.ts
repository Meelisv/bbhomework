import { test, expect } from '@playwright/test';
import { fillCalculator, saveLoanButton, editLoanButton, verifyAmount, randomLoanAmount, randomLoanPeriod } from './uiconfigs/helpers';
import { sendApiRequest, conclusionFeeCalc } from './uiconfigs/calculatorAPI';

test('Verifying loan amount change on the landing page if saved or not', async ({ browser  }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  await fillCalculator(page, '5000', '10');
  await saveLoanButton(page);
  const totalAmount = await page.locator('.bb-edit-amount__amount');
  await verifyAmount(totalAmount, /5000\s?€/);
  await editLoanButton(page);

  //not saving the change
  await page.waitForSelector('input[name="header-calculator-amount"]');
  await page.locator('input[name="header-calculator-amount"]').fill('10000');
  await page.getByRole('dialog').getByRole('button').first().click(); //clicking X on the popup to close it
  await expect(totalAmount).toHaveText(/5000\s?€/);
  await context.close();
});


test('Verifying random values', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  
  //loan check
 const loanAmount = await randomLoanAmount(500, 30000)
  const loanPeriod = await randomLoanPeriod(40, 120);
  
  const conclusionFee = conclusionFeeCalc(loanAmount);
  const apiResponse = await sendApiRequest(page, loanAmount, conclusionFee, loanPeriod);
  const expectedMonthlyPayment = apiResponse.monthlyPayment.toFixed(2);

  await fillCalculator(page, loanAmount.toString(), loanPeriod.toString());
  await page.locator('input[name="header-calculator-amount"]').click();

  //monthly payment verify check
  const monthlyPaymentLocator = await page.locator('.bb-labeled-value__value');
  await expect(monthlyPaymentLocator).toHaveText(`€${expectedMonthlyPayment}`, { timeout: 1000 });
  console.log('Monthly Payment for', loanAmount, '+', loanPeriod, 'months:', expectedMonthlyPayment); // placeholder print

  await context.close();
});


test('Verifying minimum values', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  
  //loan check
  const loanAmount = 500;
  const loanPeriod = 6;

  const conclusionFee = conclusionFeeCalc(loanAmount);
  const apiResponse = await sendApiRequest(page, loanAmount, conclusionFee, loanPeriod);
  const expectedMonthlyPayment = apiResponse.monthlyPayment.toFixed(2);

  await fillCalculator(page, loanAmount.toString(), loanPeriod.toString());
  
  await page.locator('input[name="header-calculator-amount"]').click();
  await page.locator('input[name="header-calculator-period"]').click();
  
  //monthly payment verify check
  const monthlyPaymentLocator = await page.locator('.bb-labeled-value__value');
  await expect(monthlyPaymentLocator).toHaveText(`€${expectedMonthlyPayment}`, { timeout: 1000 });
  console.log('Monthly Payment for', loanAmount, '+', loanPeriod, 'months:', expectedMonthlyPayment); // placeholder print
  await context.close();

});

test('Verifying maximum values', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  
  //loan check
  const loanAmount = 30000;
  const loanPeriod = 120;

  const conclusionFee = conclusionFeeCalc(loanAmount);
  const apiResponse = await sendApiRequest(page, loanAmount, conclusionFee, loanPeriod);
  //console.log('API Response:', apiResponse);
  const expectedMonthlyPayment = apiResponse.monthlyPayment.toFixed(2);

  await fillCalculator(page, loanAmount.toString(), loanPeriod.toString());
  await page.locator('input[name="header-calculator-amount"]').click();
  await page.locator('input[name="header-calculator-period"]').click();
  
  //monthly payment verify check
  const monthlyPaymentLocator1 = await page.locator('.bb-labeled-value__value');
  await expect(monthlyPaymentLocator1).toHaveText(`€${expectedMonthlyPayment}`, { timeout: 1000 });
  console.log('Monthly Payment for', loanAmount, '+', loanPeriod, 'months:', expectedMonthlyPayment); // placeholder print
  await context.close();

});


test('Verifying decimal points can be used in loan amount', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  
  //loan check
  const loanAmount = 29950.50;
  const loanPeriod = 120;

  const conclusionFee = conclusionFeeCalc(loanAmount);
  const apiResponse = await sendApiRequest(page, loanAmount, conclusionFee, loanPeriod);
  const expectedMonthlyPayment = apiResponse.monthlyPayment.toFixed(2);

  await fillCalculator(page, loanAmount.toString(), loanPeriod.toString());
  await page.locator('input[name="header-calculator-amount"]').click();
  await page.locator('input[name="header-calculator-period"]').click();
  
  //monthly payment verify check
  const monthlyPaymentLocator1 = await page.locator('.bb-labeled-value__value');
  await expect(monthlyPaymentLocator1).toHaveText(`€${expectedMonthlyPayment}`, { timeout: 1000 });
  console.log('Monthly Payment for', loanAmount, '+', loanPeriod, 'months:', expectedMonthlyPayment); // placeholder print
  await context.close();

});
