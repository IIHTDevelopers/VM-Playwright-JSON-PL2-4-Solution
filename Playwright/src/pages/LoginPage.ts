import { Locator, Page } from "@playwright/test";
const data = JSON.parse(JSON.stringify(require("../Data/login.json")));

export default class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
 
  private getButton : Locator;
  constructor(page: Page) {
    this.page = page;
    this.getButton = page.locator("//div[@class='oxd-topbar-body-nav-slot']/button");
    this.usernameInput = page.locator("//input[@placeholder='username' or @placeholder='Username']");
    this.passwordInput = page.locator("//input[@placeholder='password' or @placeholder='Password']");
    this.loginButton = page.locator("//button[@type='submit']");
  }
  async performLogin() {
    await this.usernameInput.fill(data.ValidLogin.ValidUserName);
    await this.passwordInput.fill(data.ValidLogin.ValidPassword);
    await this.loginButton.click();
    return this.page.url();
  }

 

 


  /**
 * Clicks the 'Get Help' button and returns the URL of the newly opened page.
 */
async getUrl(): Promise<string> {
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent('page'), // Wait for new tab
    this.getButton.click(),                   // Trigger click on help button
  ]);
  await newPage.waitForLoadState();           // Ensure the page loads completely
  return newPage.url();                       // Return the URL of the new tab
}
}