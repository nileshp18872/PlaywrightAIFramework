import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';
import { MyAccountPage } from './MyAccountPage';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly headingSuccess: Locator;
    private readonly btnContinue: Locator;
    private readonly myAccountDropdown: Locator;
    private readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingSuccess = page.locator('#content h1');
        this.btnContinue = page.locator('#content a.btn-primary');
        this.myAccountDropdown = page.locator('a[title="My Account"]');
        this.logoutLink = page.locator('#top-links').getByRole('link', { name: 'Logout' });
    }

    /**
     * Gets the account creation confirmation heading text
     * @returns Promise<string> - Heading text
     */
    async getSuccessMessage(): Promise<string> {
        return (await this.headingSuccess.innerText()).trim();
    }

    /**
     * Verifies if the account creation success page is displayed
     * @returns Promise<boolean> - true if success heading is visible
     */
    async isSuccessPageExists(): Promise<boolean> {
        try {
            await this.headingSuccess.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingSuccess.isVisible();
        } catch (error) {
            console.log(`Error checking account success page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button on the success page
     * @returns Promise<MyAccountPage> - Instance of MyAccountPage
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.btnContinue.click();
        return new MyAccountPage(this.page);
    }

    /**
     * Clicks the Logout option via My Account dropdown
     * @returns Promise<LogoutPage> - Instance of LogoutPage
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.myAccountDropdown.click();
        await this.logoutLink.click();
        return new LogoutPage(this.page);
    }
}
