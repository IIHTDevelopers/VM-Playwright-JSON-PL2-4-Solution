import { Page, Locator, expect, Download } from "@playwright/test";
import * as fs from 'fs';
import * as path from 'path';
import { LoadFnOutput } from "module";
import { text } from "stream/consumers";
const downloadDir = path.resolve(__dirname, '../downloads');

export default class AdminPage {
  readonly page: Page;
  private resetBtn : Locator;
  private adminSubtab : Locator;
  private downloadBtn : Locator;
  private lang : Locator;
 private configTab : Locator;
  private searchBtn: Locator;
  private adminInput : Locator;
  private AdminLink: Locator;
  private editbutton: Locator;
  private userName: Locator;
  private sucessMessage: Locator;
  private usernameButton: Locator;
  private colorInput : Locator;
  private primaryColorBtn : Locator;
  private crpTab : Locator;
  private publishBtn : Locator;
  private ColorAttribute : Locator;


  constructor(page: Page) {
    this.page = page;
    this.resetBtn = page.locator("//button[text()=' Reset to Default ']");
    this.adminSubtab = page.locator("//a[text()='Nationalities']");
    this.downloadBtn = page.locator("//i[@class='oxd-icon bi-download']");
    this.lang = page.locator("//a[text()='Language Packages']");
    this.configTab = page.locator("//span[text()='Configuration ']");
     this.publishBtn= page.locator("//button[text()=' Publish ']");
    this.ColorAttribute= page.locator("//div[@class='oxd-color-input-preview']");
    this.primaryColorBtn = page.locator("//div[@class='oxd-color-input oxd-color-input--active' ]");
    this.crpTab= page.locator("//a[text()='Corporate Branding']");
    this.configTab= page.locator("//span[text()='Configuration ']");
    this.colorInput= page.locator("//input[@class='oxd-input oxd-input--active']");
    this.searchBtn = page.locator("//button[text()=' Search ']");
    this.adminInput = page.locator("//input[@class = 'oxd-input oxd-input--active']");
    this.AdminLink = page.locator("text=Admin");
    this.editbutton = page.locator("//div[@class='oxd-table-cell-actions']/button[2]");
   
    this.userName = page.locator("//input[@autocomplete='off']");
    this.sucessMessage = page.locator("(//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text'])[1]");
    this.usernameButton = page.locator("//div[@class='oxd-form-actions']/button[2]");
   
  }

  

  /**
   * Edits an existing user record in the Admin section.
   *
   * Steps:
   * 1. Navigate to the Admin tab.
   * 2. Click the edit button for the second user in the list.
   * 3. Clear the existing username and update it with a new value ("TestUser").
   * 4. Click the save/update button to submit the changes.
   * 5. Wait for the success message to confirm that the update was applied.
   * 6. Return the success message for verification in the test.
   *
   * @returns {Promise<string>} - The trimmed success message confirming the update
   */

  public async AdminEdit(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.editbutton.nth(1).scrollIntoViewIfNeeded();
    await this.editbutton.nth(1).click();
    await this.userName.clear().then(() => this.userName.fill("TestUser"));
    await this.page.waitForTimeout(1500);
    await this.usernameButton.click();
    await this.page.waitForTimeout(3000);
    const successMessage = await this.sucessMessage.textContent();
    return successMessage?.trim() || "";
  }


  
/**
 * Searches for a given admin username in the Admin section.
 *
 * @param admin - Username to search for.
 * @returns List of usernames from the second column of the result table.
 */
  public async adminSearchh(admin : string) {
    await this.AdminLink.nth(0).click();
    await this.adminInput.nth(1).fill(admin);
    await this.searchBtn.click();
    await this.page.waitForTimeout(3000);
    return this.page.locator("//div[@role='row']/div[2]").allInnerTexts();


    
  }

 


   /**
 * Updates the primary corporate branding color and returns the style attribute for validation.
 */
async primaryColor(): Promise<string> {
  await this.AdminLink.nth(0).click();
  await this.page.waitForTimeout(2000);
  await this.crpTab.click();
  await this.primaryColorBtn.nth(0).click();
  await this.colorInput.nth(1).fill("#826137");
  await this.publishBtn.click();
  const attribute = await this.ColorAttribute.nth(0).getAttribute("style");
  console.log(attribute);
  return attribute ?? " ";
}

/**
 * Downloads a language package from the Admin > Configuration > Language section.
 *
 * @returns The name of the downloaded file.
 */
async downloadLanguageModule() {
  await this.AdminLink.nth(0).click();             // Navigate to Admin section
  await this.configTab.click();                    // Click on Configuration tab
  await this.lang.click();                         // Open Language settings
  await this.page.waitForTimeout(3000);            // Wait for content to load

  ensureDownloadFolder();                          // Ensure download directory exists

  const [download] = await Promise.all([
    this.page.waitForEvent('download'),            // Listen for download event
    this.downloadBtn.nth(1).click()                // Trigger file download
  ]);

  const filename = download.suggestedFilename();   // Get the suggested filename
  const filePath = path.join(downloadDir, filename); // Build full file path
  await download.saveAs(filePath);                 // Save the file to disk

  await this.page.waitForTimeout(2000);            // Optional wait for safety
  return filename;                                 // Return the filename for verification
}



/**
 * Navigates to the Admin section and retrieves the class name
 * of the "Nationalities" subtab after interaction.
 *
 * @returns The value of the class attribute for the subtab element.
 */
async hoverAdmin() {
  await this.AdminLink.nth(0).click();                      
  await this.adminSubtab.click();                           
  return this.page.locator("//a[text()='Nationalities']/parent::li").getAttribute("class");                                  
}


/**
 * Navigates to the Corporate Branding tab and resets the theme colors to default.
 *
 * @returns The inline style attribute value of the color preview box.
 */
async resetColor() {
  await this.AdminLink.nth(0).click();                                    // Open Admin section
  await this.page.waitForTimeout(2000);
  await this.crpTab.click();                                              
  await this.resetBtn.click();                                            
  await this.page.waitForTimeout(3000);                                   

  return await this.page.locator("//div[@class='oxd-color-input-preview']").nth(0).getAttribute("style");                                              
}


}

function generateUniqueUsername(base: string = "TestUser"): string {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${base}${uniqueSuffix}`;
}


function ensureDownloadFolder() {
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir)
  }
}

