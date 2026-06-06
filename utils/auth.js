//parej45122@nriza.com
//Theek@123
const {test,expect} = require('@playwright/test');

export async function login(page){
    
    await page.goto('login');

    await page.locator('[id="email"]').fill("parej45122@nriza.com");
    await page.locator('[id="password"]').fill("Theek@123");

    await page.locator('[id="login-btn"]').click();

    //assertion
    await expect(page.locator('[id="logout-btn"]')).toBeVisible();
}