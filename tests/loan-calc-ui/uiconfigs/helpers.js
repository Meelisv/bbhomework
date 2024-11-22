import { expect } from '@playwright/test';

export async function fillCalculator(page, amount, period) {
    await page.waitForSelector('input[name="header-calculator-amount"]');
    await page.locator('input[name="header-calculator-amount"]').fill(amount);
    await page.waitForSelector('input[name="header-calculator-period"]');
    await page.locator('input[name="header-calculator-period"]').fill(period);
  }


  export async function saveLoanButton(page) {
    await page.locator('.bb-calculator-modal__submit-button.bb-button.bb-button--label.bb-button--mint.bb-button--md.bb-button--block').click();
  }

  export async function editLoanButton(page) {
    await page.locator('.bb-edit-amount.bb-navbar__edit-amount.bb-button.bb-button--icon-after.bb-button--no-background.bb-button--gray.bb-button--md.bb-button--narrow').click();
  }
  
  export async function verifyAmount(locator, expectedText) {
    await expect(locator).toHaveText(expectedText);
  }

  export async function randomLoanAmount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  export async function randomLoanPeriod(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }