import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingLogout: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingLogout = page.locator('#content h1');
        this.btnContinue = page.locator('#content a.btn-primary');
    }

    /**
     * Verifies if the Logout confirmation page is displayed
     * @returns Promise<boolean> - true if the Account Logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            await this.headingLogout.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingLogout.isVisible();
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button on the logout confirmation page
     * @returns Promise<HomePage> - Instance of HomePage
     */
    async clickContinue(): Promise<HomePage> {
        await this.btnContinue.click();
        return new HomePage(this.page);
    }
}
