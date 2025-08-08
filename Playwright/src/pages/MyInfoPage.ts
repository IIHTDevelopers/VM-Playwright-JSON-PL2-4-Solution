import { Locator, Page } from "@playwright/test";
import path from "path";
import LoginPage from "./LoginPage";
const filePath = path.resolve(__dirname, "../../sample_upload.pdf");

export class MyInfoPage {
  readonly page: Page;
  private textinput : Locator;
  private addFile : Locator;
  private contactBtn :Locator;
  private saveBtn : Locator;
  private Myinfo: Locator;
 
  constructor(page: Page) {
    this.page = page;
    this.textinput = page.locator("//textarea[@placeholder='Type comment here']")
    this.addFile = page.locator("//button[text()=' Add ']");
    this.contactBtn = page.locator("//a[text()='Contact Details']");
    this.Myinfo = page.locator("text=My Info");
  
    this.saveBtn= page.locator("//button[text()=' Save ' ]");
  }

 

 /**
 * Uploads an attachment with a given comment in the My Info > Contact Details section.
 *
 * @param comnt - A unique comment to associate with the uploaded file.
 * @returns A list of text entries matching the uploaded comments (post-upload).
 */
async UploadAttachmentInDependent(comnt: string) {
  await this.Myinfo.click();                                 // Navigate to My Info
  await this.contactBtn.click();                             // Go to Contact Details section
  await this.addFile.click();                                // Click Add Attachment
  await this.textinput.scrollIntoViewIfNeeded();             // Scroll comment input into view
  await this.textinput.fill(comnt);                          // Fill comment

  const fileInput = this.page.locator('input[type="file"]'); // Locate file input
  await fileInput.setInputFiles(filePath);                   // Upload file

  await this.saveBtn.nth(1).click();                          // Click Save
  await this.page.waitForTimeout(6000);                       

  const value = this.page.locator(`//div[text()='${comnt}']`).allInnerTexts();                                         

  return value;
}



}
