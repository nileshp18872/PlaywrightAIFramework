import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('input[value="Login"]');
        this.alertWarning = page.locator('.alert-danger');
    }

    /**
     * Navigates directly to the OpenCart login page
     * @param url - Optional specific URL (defaults to account/login route)
     */
    async navigate(url?: string): Promise<void> {
        await this.page.route('**/*addthis*', route => route.abort()).catch(() => {});
        const targetUrl = url || `${process.env.WEB_APP_URL || 'http://localhost/opencart/upload/'}index.php?route=account/login`;
        await this.page.goto(targetUrl);
    }

    /**
     * Fills the email field
     * @param email - Customer login email
     */
    async setEmail(email?: string): Promise<void> {
        if (email && email.trim() !== '') {
            await this.txtEmail.fill(email);
        } else {
            await this.txtEmail.clear();
        }
    }

    /**
     * Fills the password field
     * @param password - Customer login password
     */
    async setPassword(password?: string): Promise<void> {
        if (password && password.trim() !== '') {
            await this.txtPassword.fill(password);
        } else {
            await this.txtPassword.clear();
        }
    }

    /**
     * Clicks the login submit button
     * @returns Promise<MyAccountPage> - Instance of MyAccountPage
     */
    async clickLogin(): Promise<MyAccountPage> {
        await this.btnLogin.click();
        return new MyAccountPage(this.page);
    }

    /**
     * Performs customer login with provided email and password
     * @param email - Customer login email
     * @param password - Customer login password
     * @returns Promise<MyAccountPage> - Instance of MyAccountPage
     */
    async login(email?: string, password?: string): Promise<MyAccountPage> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            return await this.clickLogin();
        } catch (error) {
            console.log(`Error during customer login: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies if the Login page is displayed
     * @returns Promise<boolean> - true if login button is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.btnLogin.waitFor({ state: 'visible', timeout: 5000 });
            return await this.btnLogin.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies if warning alert is displayed
     * @returns Promise<boolean> - true if warning alert is visible
     */
    async isWarningMessageVisible(): Promise<boolean> {
        try {
            await this.alertWarning.waitFor({ state: 'visible', timeout: 5000 });
            return await this.alertWarning.isVisible();
        } catch (error) {
            console.log(`Error checking warning message: ${error}`);
            return false;
        }
    }

    /**
     * Gets the warning or error alert message text
     * @returns Promise<string> - Warning message text
     */
    async getWarningMessage(): Promise<string> {
        await this.alertWarning.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.alertWarning.innerText()).trim();
    }
}
