import { Page, Locator } from '@playwright/test';
import { AccountSuccessPage } from './AccountSuccessPage';

export interface UserRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
}

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly headingRegister: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingRegister = page.locator('#content h1');
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtConfirmPassword = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('input[value="Continue"]');
    }

    /**
     * Fills the First Name field
     * @param firstName - Customer first name
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Fills the Last Name field
     * @param lastName - Customer last name
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Fills the Email Address field
     * @param email - Customer email address
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Fills the Telephone field
     * @param telephone - Customer telephone number
     */
    async setTelephone(telephone: string): Promise<void> {
        await this.txtTelephone.fill(telephone);
    }

    /**
     * Fills the Password field
     * @param password - Account password
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Fills the Password Confirm field
     * @param password - Account confirmation password
     */
    async setPasswordConfirm(password: string): Promise<void> {
        await this.txtConfirmPassword.fill(password);
    }

    /**
     * Checks the Privacy Policy checkbox
     */
    async setPrivacyPolicy(): Promise<void> {
        await this.chkPrivacyPolicy.check();
    }

    /**
     * Clicks the Continue button on the registration form
     * @returns Promise<AccountSuccessPage> - Instance of AccountSuccessPage
     */
    async clickContinue(): Promise<AccountSuccessPage> {
        await this.btnContinue.click();
        return new AccountSuccessPage(this.page);
    }

    /**
     * Composite method to fill and submit the complete customer registration form
     * @param userData - Object containing registration values
     * @returns Promise<AccountSuccessPage> - Instance of AccountSuccessPage
     */
    async registerAccount(userData: UserRegistrationData): Promise<AccountSuccessPage> {
        try {
            await this.setFirstName(userData.firstName);
            await this.setLastName(userData.lastName);
            await this.setEmail(userData.email);
            await this.setTelephone(userData.telephone);
            await this.setPassword(userData.password);
            await this.setPasswordConfirm(userData.password);
            await this.setPrivacyPolicy();
            return await this.clickContinue();
        } catch (error) {
            console.log(`Error during customer registration: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies if the Register page is displayed
     * @returns Promise<boolean> - true if the Register Account heading is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            await this.headingRegister.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingRegister.isVisible();
        } catch (error) {
            console.log(`Error checking register page: ${error}`);
            return false;
        }
    }
}
