/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Description:
 * Validates OpenCart customer login using test data loaded from an external file,
 * with one independent test generated per data row.
 *
 * Tags: @master @datadriven @web
 *
 * Steps:
 * 1) Open the OpenCart login page (http://localhost/opencart/upload/index.php?route=account/login)
 * 2) Enter the email and password (leave field empty if value is blank/whitespace)
 * 3) Submit the login form
 * 4) Validate result based on expected value (success / failure)
 */

import path from 'path';
import fs from 'fs';
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';
import { executeQuery } from '../../utils/dbClient';

interface LoginTestData {
    testName?: string;
    TestName?: string;
    email?: string;
    password?: string;
    expected: 'success' | 'failure';
}

// Resolve external test data file (supporting opencart_logindata.json or opencart_logindataJSON.json)
const primaryDataPath = path.resolve(__dirname, '../../testdata/opencart_logindata.json');
const fallbackDataPath = path.resolve(__dirname, '../../testdata/opencart_logindataJSON.json');
const dataFilePath = fs.existsSync(primaryDataPath) ? primaryDataPath : fallbackDataPath;

const loginDataSet: LoginTestData[] = DataProvider.readJson(dataFilePath);

test.describe('OpenCart Customer Login - Data Driven @master @datadriven @web', () => {
    test.beforeAll(async () => {
        try {
            await executeQuery('DELETE FROM oc_customer_login');
        } catch {
            // Optional DB reset if DB is not reachable
        }
    });

    for (const [index, row] of loginDataSet.entries()) {
        const scenarioName = row.testName || row.TestName || `Row ${index + 1}`;

        test(`Validate customer login: ${scenarioName} @master @datadriven @web`, async ({
            loginPage,
            myAccountPage,
        }) => {
            await test.step('1) Open the OpenCart login page', async () => {
                await loginPage.navigate();
                const isLoginPage = await loginPage.isLoginPageExists();
                expect(isLoginPage).toBeTruthy();
            });

            await test.step('2) Enter the email and password', async () => {
                const email = row.email ? row.email.trim() : '';
                const password = row.password ? row.password.trim() : '';

                if (email !== '') {
                    await loginPage.setEmail(email);
                }
                if (password !== '') {
                    await loginPage.setPassword(password);
                }
            });

            await test.step('3) Submit the login form', async () => {
                await loginPage.clickLogin();
            });

            await test.step(`4) Validate the result based on expected: ${row.expected}`, async () => {
                const isExpectedSuccess = row.expected.toLowerCase() === 'success';

                if (isExpectedSuccess) {
                    // For expected: success
                    // - Verify login is successful
                    // - Verify the My Account page is displayed
                    const isMyAccountVisible = await myAccountPage.isMyAccountPageExists();
                    expect(isMyAccountVisible).toBeTruthy();
                } else {
                    // For expected: failure
                    // - Verify login is unsuccessful
                    // - Verify the appropriate OpenCart warning/error message
                    const isMyAccountVisible = await myAccountPage.isMyAccountPageExists(2000);
                    expect(isMyAccountVisible).toBeFalsy();

                    const isWarningVisible = await loginPage.isWarningMessageVisible();
                    expect(isWarningVisible).toBeTruthy();

                    const warningMessage = await loginPage.getWarningMessage();
                    expect(warningMessage).toMatch(
                        /Warning: (No match for E-Mail Address and\/or Password\.|Your account has exceeded allowed number of login attempts\. Please try again in 1 hour\.)/
                    );
                }
            });

            console.log(`✅ ✔️ Completed successfully: "${scenarioName}" (expected: ${row.expected})`);
        });
    }
});
