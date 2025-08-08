import { chromium, test } from "playwright/test";
import { Page, Locator, expect } from "@playwright/test";
import AdminPage from "src/pages/AdminPage";
import LoginPage from "src/pages/LoginPage";
import { MyInfoPage } from "src/pages/MyInfoPage";
import BuzzPage  from "src/pages/BuzzPage";
import PIMPage from "src/pages/PIMPage";
import * as fs from 'fs';
import * as path from 'path';
const downloads = path.resolve(__dirname, '../../downloads');
const data = JSON.parse(JSON.stringify(require("../../Data/login.json")));


test.describe("Yaksha", () => {
  let loginPage: LoginPage;
  let myinfoPage: MyInfoPage;
  let adminPage: AdminPage;
  let buzzPage :BuzzPage;
  let PimPage : PIMPage;

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto("https://yakshahrm.makemylabs.in/orangehrm-5.7");
    loginPage = new LoginPage(page);
    myinfoPage = new MyInfoPage(page);
    adminPage = new AdminPage(page);
    buzzPage = new BuzzPage(page)
    PimPage = new PIMPage(page);
    
    await loginPage.performLogin();
  });






 /**
 * Test Case: 1_Verify admin Search Functionality
 *
 * Purpose:
 * Validates that the Admin search functionality works correctly by searching 
 * for an existing username and verifying the search result contains the query.
 *
 * Steps:
 * 1. Navigate to the Admin section.
 * 2. Input a valid admin username into the search field.
 * 3. Click on the search button.
 * 4. Wait for the results to load.
 * 5. Verify that the username appears in the search results.
 */

test("1_Verify admin Search Functionality", async ({ page }) => {
  const admin = "admin";
  const searchOutput = await adminPage.adminSearchh(admin);
  expect(searchOutput).toContain(admin);
});






/*
  TS-2: Validate photo sharing functionality with confirmation message

  This test validates that a user can successfully share a photo post
  on the Buzz page and that the action is accompanied by a confirmation
  (in this case, the actual posted comment text).

  The test performs the following actions:

  - Navigates to the Buzz page
  - Clicks the "Share Photos" button
  - Enters a unique comment with a timestamp
  - Uploads an image file from local storage
  - Submits the post
  - Reloads the page to reflect the new post
  - Returns and logs the posted comment for validation

  This test ensures that the photo post functionality works correctly
  and that the user's comment is properly associated with the shared photo.
*/
  test("TS-2: Validate photo sharing functionality with confirmation message", async ({page,}) => {
    const commentText = await buzzPage.SharePhotoPost();
    console.log("Photo shared with confirmation message: ", commentText);

    // Assertion: Check that the submitted comment is present in the list
    const commentList = await page.locator("//p[contains(@class,'orangehrm-buzz-post-body-text')]").allInnerTexts();
    expect(commentList).toContain(commentText);
  });





 /*
  TS-3: Verify 'Like' button increments like count

  This test ensures the functionality of the 'Like' feature on the Buzz page.
  It validates whether clicking the 'Like' button on a post correctly updates
  the like count shown to the user.

  The test performs the following steps:

  - Navigates to the Buzz section
  - Fetches the current like count on the first visible post
  - Clicks the 'Like' button
  - Retrieves the updated like count
  - Validates that the count has increased after the click

  This test confirms that the like interaction works and reflects immediately in the UI.
*/
  test("TS-3: Verify 'Like' button increments like count", async ({ page }) => {
    const { initialNumber, updatedNumber } = await buzzPage.likePost();
    await assertLikeCountIncreased(initialNumber, updatedNumber);
  });

 



 /*
  TS-4: Ensure comment can be successfully added to a post

  This test verifies the functionality of adding a comment to a post 
  on the Buzz page. It confirms that the comment is submitted and 
  appears correctly in the comment list.

  The test follows these steps:

  - Navigates to the Buzz section
  - Clicks on the comment button for the first post
  - Fills in a unique comment using a timestamped message
  - Submits the comment by pressing Enter
  - Retrieves the most recent comment text
  - Collects all comment elements on the page
  - Verifies that the posted comment is present in the list
  This ensures the comment submission flow is working correctly and the UI reflects the new comment as expected.

*/
  test("TS-4: Ensure comment can be successfully added to a post", async ({
    page,
  }) => {
    const postedComment = await buzzPage.addCommentToPost();
    const cmntList = await page.locator('//div/span[text()=""]').allTextContents();
    await assertCommentExists(postedComment, cmntList);
  });





 /*
  TS-5: Ensure admin can edit user records

  This test verifies that an admin user is able to initiate the edit process
  for a user record from the Admin section. It performs the following actions:

  - Navigates to the Admin section using the Admin link
  - Clicks on the edit button corresponding to a user entry

  The test confirms that the edit user interface becomes accessible, indicating
  that the edit flow is properly triggered.
*/
  test("TS-5: Ensure admin can edit user records", async ({ page }) => {
    await adminPage.AdminEdit();
    await assertEditUserHeaderVisible(page);
  });





 /**
 * Test Case: 6_Verify 'Delete Post' Functionality
 *
 * Objective:
 * Ensure that a user is able to delete a Buzz post successfully and receive a confirmation message.
 *
 * Steps Performed:
 *  1. Navigate to the Buzz page.
 *  2. Click on the delete toggle/menu of the first post.
 *  3. Click the delete button to trigger confirmation.
 *  4. Confirm the deletion in the confirmation dialog.
 *  5. Wait for completion and retrieve the success message.
 *  6. Assert that the confirmation message contains "Successfully Deleted".
 *
 * Expected Result:
 * A success message "Successfully Deleted" should appear after the post is deleted.
 */
test("TS_6_Verify 'Delete Post' Functionality", async ({ page }) => {
  const deleteConfirmText = await buzzPage.delete();
  expect(deleteConfirmText).toContain("Successfully Deleted");
  console.log("Post deleted successfully");
});


 /**
 * Test Case: TS-7 Verify 'Get Help' Button is Functional
 *
 * Objective:
 * Validate that clicking the 'Get Help' button opens a new browser tab with the expected help URL.
 *
 * Steps:
 * 1. Clicks the 'Get Help' button on the login page.
 * 2. Waits for a new browser tab to open.
 * 3. Waits for the new page to fully load.
 * 4. Extracts and returns the URL of the newly opened tab.
 * 5. Asserts that the actual URL matches the expected help URL.
 */
test("TS-7 Verify 'Get' help button is functional", async ({ page }) => {
  const expectedUrl = "https://starterhelp.orangehrm.com/hc/en-us";
  const actualUrl = await loginPage.getUrl();
  expect(actualUrl).toBe(expectedUrl);
  console.log("Help page opened successfully");
});




    /**
 * Test Case: TS-8 Verify List of Reports
 *
 * Objective:
 * Ensure that the list of employee reports is fetched successfully from the PIM section.
 *
 * Steps:
 * 1. Navigate to the PIM section by clicking the PIM link.
 * 2. Click on the "Employee List" button to view reports.
 * 3. Wait for the employee list to load.
 * 4. Extract all employee IDs as text content.
 * 5. Assert that the employee list is not empty.
 */
test("TS-8 Verify List of Reports", async ({ page }) => {
  const empList = await PimPage.getEmpList();
  expect(empList.length).toBeGreaterThan(0);
  console.log(`Employee list retrieved successfully: ${empList.length}`);
});






  /**
 * Test Case: TS-9
 * Objective: Verify that the Employee Search functionality works as expected.
 * 
 * Steps:
 * 1. Navigate to PIM > Employee List.
 * 2. Capture an Employee ID from the list.
 * 3. Enter the same ID into the search field and perform the search.
 * 4. Assert that the result contains the correct Employee ID.
 */
test("TS-9 Verify Employee List Search functionality", async ({ page }) => {
  const empId = await PimPage.verifyEmp();       // Capture and search Employee ID
  await assertSearchedEmpId(page, empId);        // Validate search result
});







 /**
 * Test Case: TS-10 Verify Primary Colour of corporate branding could be changed
 *
 * Objective:
 * Ensure that the primary color under corporate branding can be updated successfully.
 *
 * Steps:
 * 1. Navigate to the Admin section.
 * 2. Click on the "Corporate Branding" tab.
 * 3. Select and modify the primary color input field.
 * 4. Click the "Publish" button to apply the changes.
 * 5. Fetch the inline style attribute to confirm the color has been applied.
 * 6. Assert that the color code matches the expected value using a helper.
 */

test("TS-10 Verify Primary Colour of corporate branding could be changed", async ({ page }) => {
  const actualStyle = await adminPage.primaryColor(); // returns the style string
  expectPrimaryColorStyle(actualStyle); // assert in helper function
});


/**
 * Test Case: TS_11
 * Objective: Verify that the Language Packages can be successfully downloaded.
 *
 * Steps:
 * 1. Navigate to Admin > Configuration > Language section.
 * 2. Initiate the download of a language module.
 * 3. Verify that the file was downloaded to the expected location.
 */
test("TS_11_Verify the Language Packages could be downloaded", async ({ page }) => {
  const fileName = await adminPage.downloadLanguageModule();     // Trigger download
  const exists = verifyDownloadedFileExists(fileName);           // Check if file exists
  expect(exists).toBeTruthy();                                   // Assert file was downloaded
});

  
/**
 * Test Case: TS-12 Verify the Subtabs CSS class changes on hover
 *
 * Purpose:
 * Validates that hovering over a subtab in the Admin section applies the expected CSS class.
 *
 * Steps:
 * 1. Navigate to the Admin section.
 * 2. Hover over the "Nationalities" subtab.
 * 3. Capture the class attribute of the hovered element.
 * 4. Assert that the class includes the expected hover-related class.
 */
test("TS-12 Verify the Subtabs css change after hovering over the element", async ({ page }) => {
  const message = await adminPage.hoverAdmin();       // Hover and capture class
  console.log(message);
  expect(message).toContain("oxd-topbar-body-nav-tab --visited"); // Validate class change
});






/**
 * Test Case: TS-13 Verify two employees with the same Employee ID cannot be created
 *
 * Purpose:
 * To ensure the system prevents creation of duplicate Employee IDs.
 *
 * Steps:
 * 1. Navigate to the PIM > Employee List page.
 * 2. Capture the Employee ID of an existing employee.
 * 3. Click the Add button to create a new employee.
 * 4. Enter the captured Employee ID in the form.
 * 5. Verify that an appropriate error message is shown.
 */
test("TS-13 Verify two employees with same employee ID can't be created", async ({ page }) => {
  const msg = await PimPage.EmpIdError();                         // Try to reuse an existing ID
  expect(msg).toContain("Employee Id already exists");            // Validate error message
});


  

/**
 * Test Case: TS-14 Verify the 'Maintenance' tab only allows admin to access
 *
 * Purpose:
 * To ensure that access to the Maintenance tab is restricted and only accessible with valid admin credentials.
 *
 * Steps:
 * 1. Click on the Maintenance tab.
 * 2. Enter the admin password to gain access.
 * 3. Confirm the password entry.
 * 4. Verify that the Maintenance page is displayed by checking the page header.
 */
  test("TS-14 Verify the Corporate branding reset to default functionality", async ({ page }) => {
    const Msg = await adminPage.resetColor();
    console.log(Msg?.split(';'));
    expect(Msg?.split(';')).toContain("background-color: rgb(255, 123, 29)");
  });


/**
 * Test Case: TC-15 Verify attachment can be uploaded in the My Info tab
 *
 * Purpose:
 * To ensure that a file attachment with a custom comment can be successfully uploaded
 * and is visible under the Dependents or Contact section of My Info.
 *
 * Steps:
 * 1. Generate a unique comment.
 * 2. Navigate to My Info > Contact section.
 * 3. Upload a file with the comment.
 * 4. Verify that the comment appears in the list after upload.
 */
test("TC-15 Verify attachment could be uploaded to the My Info tab", async () => {
  const comnt = generateUniqueComment();                            // Step 1: Unique comment
  const list = await myinfoPage.UploadAttachmentInDependent(comnt); // Step 2–4
  expect(list.length).toBeGreaterThan(0);                            // Ensure something was uploaded
  expect(list).toContain(comnt);                                     // Ensure correct comment is present
});




});

/**
 * ------------------------------------------------------Helper Methods----------------------------------------------------
 */

function verifyDownloadedFileExists(filename: string): boolean {
  const filePath = path.join(downloads, filename);
   const files = fs.readdirSync(downloads); // Get all files in the directory
  return files.includes(filename);
}

export function expectPrimaryColorStyle(actual: string) {
  const expected = "background-color: rgb(130, 97, 55); opacity: 1; cursor: pointer;";
  expect(actual.trim()).toBe(expected);
}

async function assertSearchedEmpId(page: Page, expectedEmpId: string) {
  const displayedEmpId = await page.locator("//div[@class='oxd-table-card']//div[@role='cell']").nth(1).textContent();
  expect(displayedEmpId?.trim()).toBe(expectedEmpId);
}

async function assertEditUserHeaderVisible(page: Page) {
  await expect(page.locator("//h6[text()='Edit User']")).toBeVisible();
}

async function assertCommentExists(postedComment: string, cmntList: string[]) {
  expect(cmntList.some((c) => c.trim() === postedComment.trim())).toBe(true);
}

 async function assertLikeCountIncreased(
  initialNumber: number,
  updatedNumber: number
) {
  expect(updatedNumber).toBeGreaterThan(initialNumber);
}

function generateUniqueComment() {
  const timestamp = Date.now(); // current time in milliseconds
  const random = Math.floor(Math.random() * 10000); // random 4-digit number
  return `upload${timestamp}${random}`;
}

function assertUrlsContainKeywords(urls: string[], keywords: string[]) {
  for (const keyword of keywords) {
    const matched = urls.some(url => url.toLowerCase().includes(keyword.toLowerCase()));
    expect(matched).toBeTruthy();
  }
}

  async function assertUrl(actualUrl: string, expectedUrl: string) {
  expect(actualUrl).toBe(expectedUrl);
  console.log(`Asserted URL: ${actualUrl}`);
}




async function assertItemPresentInList(
  listText: string,
  expectedItem: string,
  successMessage: string
) {
  await new Promise((r) => setTimeout(r, 2000));
  expect(listText).toContain(expectedItem);
  console.log(successMessage);
}

async function assertExactErrorMessage(
  actualMessage: string,
  expectedMessage: string,
  logMessage: string
) {
  expect(actualMessage).toBe(expectedMessage);
  console.log(logMessage);
}

async function assertSuccessMessageContains(
  actualMessage: string,
  expectedSubstring: string,
  logMessage: string
) {
  expect(actualMessage).toContain(expectedSubstring);
  console.log(logMessage);
}

async function assertDeletionSuccess(
  actualMessage: string,
  expectedText: string = "Successfully Deleted",
  logMessage: string = "User deleted successfully"
) {
  expect(actualMessage).toContain(expectedText);
  console.log(logMessage);
}






 

