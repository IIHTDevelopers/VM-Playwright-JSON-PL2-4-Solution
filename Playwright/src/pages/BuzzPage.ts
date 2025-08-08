import { Page, Locator, expect } from "@playwright/test";
import path from "path";

// ✅ Define file path for the image to be uploaded
const filePath = path.resolve(__dirname, "../../TestImage.jpg");

/**
 * Page Object Model for Buzz Page interactions.
 */
export default class buzzPage {
  readonly page: Page;

  // Locators used in Buzz Page
  private buzzLink: Locator;
  private firstPostFooter: Locator;
  private deleteToggle : Locator;
  private deleteButton: Locator;
  private verifyCmnt: Locator;
  private deleteConfirmation: Locator ;
  private cmnt: Locator;
  private sharephoto: Locator;
  private buzzImage: Locator;
  private submitButton: Locator;
  private photoComment: Locator;
  private likeCount: Locator;
  private likeButton: Locator;
  private commentInput: Locator;
  private firstCommentButton: Locator;
  private latestComment: Locator;
 
  constructor(page: Page) {
    this.page = page;
    this.buzzLink = page.locator("span.oxd-main-menu-item--name", {hasText: "Buzz",});
    this.sharephoto = page.locator("//button[normalize-space()='Share Photos']");
    this.buzzImage = page.locator("input.oxd-file-input");
    this.submitButton = page.locator("//button[@type='submit']");
    this.photoComment = page.locator('//textarea[@placeholder="What\'s on your mind?"]');
    this.firstPostFooter = page.locator("div.orangehrm-buzz-post-footer").first();
    this.likeCount = this.firstPostFooter.locator('p:has-text("like")');
    this.likeButton = this.firstPostFooter.locator("#heart-svg");
    this.commentInput = this.page.locator('[placeholder="Write your comment..."]');
    this.firstCommentButton = this.page.locator("//div[@class='orangehrm-buzz-post-actions']/button[1]").first();
    this.latestComment = this.page.locator("//div[@class='orangehrm-post-comment-area'] / span[@class='oxd-text oxd-text--span orangehrm-post-comment-text']");
    this.verifyCmnt = this.page.locator("//div[@class='orangehrm-buzz-post-body']/p");
    this.cmnt = this.page.locator("//textarea[@placeholder='What's on your mind?']");
    this.deleteToggle = page.locator("(//button[@type='button'])[9]");
    this.deleteButton = page.locator("//li[@class='orangehrm-buzz-post-header-config-item'][1]");
    this.firstPostFooter = page.locator('div.orangehrm-buzz-post-footer').first();
    this.deleteConfirmation = page.locator("//div[@class='orangehrm-modal-footer']/button[2]");
    this.verifyCmnt = this.page.locator("//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text']"); 
    
  }

  /**
   * Uploads a photo post and returns the success message text.
   */
  async SharePhotoPost(): Promise<string> {
    await this.buzzLink.click();
    await this.page.waitForTimeout(3000);
    await this.sharephoto.click();
    await this.photoComment.nth(1).click();
    const editcmnt = generateCommentWithTimestamp("cmnt");
    await this.photoComment.nth(1).fill(editcmnt);
    await this.buzzImage.setInputFiles(filePath);
    await this.submitButton.nth(1).waitFor({ state: "visible", timeout: 2000 });
    await this.submitButton.nth(1).click();
    await this.page.waitForTimeout(5000);
    await this.buzzLink.click();
    await this.page.reload();
    await this.page.waitForTimeout(5000);
    const listCount = await this.page.locator(`//p[contains(@class,'orangehrm-buzz-post-body-text')]`);
    const listItems = await listCount.allInnerTexts();
    return editcmnt;
  }

  /**
   * Likes the first post and returns the like count before and after the click.
   */
  async likePost(): Promise<{ initialNumber: number; updatedNumber: number }> {
    await this.buzzLink.click();

    const statText = await this.likeCount.textContent();
    const initialNumber = parseInt(statText?.match(/\d+/)?.[0] || "0", 10);

    await this.likeButton.click();
    await this.page.waitForTimeout(3000);

    const updatedStatText = await this.likeCount.textContent();
    const updatedNumber = parseInt(updatedStatText?.match(/\d+/)?.[0] || "0",10);
    return { initialNumber, updatedNumber };
  }

  /**
   * Adds a timestamped comment to the first post and returns the posted comment.
   */
  async addCommentToPost(): Promise<string> {
    const commentText = generateCommentWithTimestamp("Nice comment");
    if (!commentText) throw new Error("Comment text is null or undefined");

    await this.buzzLink.click();
    await this.page.waitForTimeout(3000);
    await this.firstCommentButton.click();

    await this.commentInput.fill(commentText);
    await this.commentInput.press("Enter");
    await this.page.waitForTimeout(2000);

    const postedCommentText = await this.latestComment.first().textContent();
    return postedCommentText?.trim() || "";
  }

  

  /**
 * Deletes the first post on the Buzz page and returns the confirmation message.
 */
public async delete(): Promise<string> {
  await this.buzzLink.click();
  await this.deleteToggle.click();
  await this.deleteButton.click();
  await this.deleteConfirmation.click();
  await this.page.waitForTimeout(1300);
  const deleteconfirmText = await this.verifyCmnt.first().textContent();
  return deleteconfirmText?.trim() || '';
}

}




  


// ------------ Helper Functions ------------

/**
 * Appends a timestamp to a comment to ensure uniqueness.
 * @param comment - Base comment text
 * @returns string - Timestamped comment
 */
function generateCommentWithTimestamp(comment: string): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${comment} ${hh}--${mm}--${ss}`;
}

//-----------------helper methods----------------
// ✅ Static comment and edit post text for testing
const commentText = "this is test comment";
const editPostText = "this is edit post comment";
