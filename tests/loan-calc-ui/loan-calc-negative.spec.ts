import { test } from '@playwright/test';
import { fillCalculator, saveLoanButton, verifyAmount } from './uiconfigs/helpers';

test('Verifying loan amount and period cannot exceed maximum value', async ({ browser  }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  await fillCalculator(page, '60000', '200');
  await saveLoanButton(page);
  const totalAmount = await page.locator('.bb-edit-amount__amount');
  await verifyAmount(totalAmount, /30000\s?€/);

  await context.close();
});

test('Verifying loan amount and period cannot go belowe minimum values', async ({ browser  }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  await fillCalculator(page, '200', '5');
  await saveLoanButton(page);
  const totalAmount = await page.locator('.bb-edit-amount__amount');
  await verifyAmount(totalAmount, /500\s?€/);

  await context.close();
});


test('Verifying loan amount and period cannot have any string values', async ({ browser  }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  await fillCalculator(page, 'test1', 'test2');
  await page.locator('input[name="header-calculator-period"]').click();
  await saveLoanButton(page);
  const totalAmount = await page.locator('.bb-edit-amount__amount');
  await verifyAmount(totalAmount, /500\s?€/);

  await context.close();
});

test('Verifying loan amount and period cannot have any special characters values', async ({ browser  }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/?amount=5000&interestRate=16.8&period=&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan');
  await fillCalculator(page, '\\!@#$%^&*()_+-=[]{}|;:\'"/<>?', '\\!@#$%^&*()_+-=[]{}|;:\'"/<>?');
  await page.locator('input[name="header-calculator-period"]').click();
  await saveLoanButton(page);
  const totalAmount = await page.locator('.bb-edit-amount__amount');
  await verifyAmount(totalAmount, /500\s?€/);

  await context.close();
});
