import { test, expect } from '@playwright/test';
import userData from "./user-data.json"
import LoginPage from "./loginPage.spec";
import HomePage from './homePage.spec';
declare const process: any;

test.describe('tests for NexLot Volunteer', ()=>{

  test("Access login page by 'already has account' button", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const password = userData.SuccessUserData.password === 'PROCESS_ENV_PASSWORD'
        ? process.env.LUME_SUCCESS_PASSWORD
        : userData.SuccessUserData.password;

  await loginPage.runLoginTest(userData.SuccessUserData.email, password, true);
  await loginPage.runLoginTest(userData.SuccessUserData.email, password, false);
  await loginPage.runLoginTest(userData.WrongUserData.email, userData.WrongUserData.password, true);
  await loginPage.runLoginTest(userData.WrongUserData.email, userData.WrongUserData.password, false);
});
  
  test("Access payment options page by 'start now' button", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.runPaymentOptionsTest();
  });
});
