import { Page, Locator, expect } from "@playwright/test";
import { assert } from "console";
export default class PIMPage {
  readonly page: Page;
    private PIMLink: Locator;
    private empListbutton: Locator;
    private getEmpId : Locator;
    private fillEmpId: Locator;
    private saveButton: Locator;
    private empList : Locator;
    private addBtn : Locator;
    private inputId : Locator;
    private errorMsg: Locator;
   
  constructor(page: Page) {
    this.page = page;
    this .errorMsg = page.locator("span.oxd-input-field-error-message");
    this.inputId = page.locator("//input[@class='oxd-input oxd-input--active']");
    this.addBtn = page.locator("//button[text()=' Add ']");
    this.empList = page.locator("//div[@role='row']/div[2]");
    this.PIMLink = page.locator('//span[text()="PIM"]');
    this.empListbutton = page.locator('//a[text()="Employee List"]');
    this.getEmpId= page.locator("//div[@class='oxd-table-row oxd-table-row--with-border oxd-table-row--clickable']/div[2]");
    this.fillEmpId= page.locator("//input[@class='oxd-input oxd-input--active']");
    this.saveButton = page.locator("//button[text()=' Search ']");


  }

  /**
 * Captures an Employee ID from the list, searches for it,
 * and returns the ID for validation.
 *
 * @returns The trimmed Employee ID string.
 */
async verifyEmp(): Promise<string> {
  await this.PIMLink.click();                     // Go to PIM module
  await this.page.waitForTimeout(2000);

  await this.empListbutton.click();               // Open Employee List
  await this.page.waitForTimeout(3000);

  const empId = await this.getEmpId.nth(1).textContent(); // Get ID from 2nd row
  console.log(`Captured Employee ID: ${empId}`);

  await this.fillEmpId.nth(1).fill(empId || "");  // Enter ID in search field
  await this.saveButton.click();                  // Perform search
  await this.page.waitForTimeout(2000);

  return empId?.trim() || "";
}




  /**
 * Navigates to the PIM section and returns a trimmed list of employee IDs.
 */
async getEmpList(): Promise<string[]> {
  await this.PIMLink.click();
  await this.page.waitForTimeout(2000);   
  await this.empListbutton.click();
  await this.page.waitForTimeout(3000); 

  const empList = await this.getEmpId.allTextContents();  
  return empList.map(emp => emp.trim());
}

/**
 * Attempts to create a new employee using an existing Employee ID
 * and returns the validation error message shown.
 *
 * @returns The error message string shown below the Employee ID input.
 */
async EmpIdError() {
  await this.PIMLink.click();                                     // Go to PIM module
  await this.page.waitForTimeout(3500);                           // Wait for page load

  const empId = await this.empList.nth(1).innerText();            // Capture existing Employee ID
  await this.addBtn.click();                                      // Click Add to create new employee
  await this.inputId.nth(1).fill(empId);                          // Fill in duplicate Employee ID
  await this.page.waitForTimeout(1000);                           // Wait for validation message

  return this.errorMsg.innerText();                               // Return error message text
}


  

  

}


//--------------------------------------------
