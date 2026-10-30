import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';
import { SearchResultsPage } from './SearchResultsPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;
    private readonly myAccountDropdown: Locator;
    private readonly logoutLink: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingMyAccount = page.locator('#content').getByRole('heading', { name: 'My Account' });
        this.myAccountDropdown = page.locator('a[title="My Account"]');
        this.logoutLink = page.locator('#top-links').getByRole('link', { name: 'Logout' });
        this.txtSearch = page.locator('input[name="search"]');
        this.btnSearch = page.locator('#search button');
    }

    /**
     * Verifies if the My Account page is displayed
     * @param timeout - Optional timeout in milliseconds (defaults to 5000)
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(timeout: number = 5000): Promise<boolean> {
        try {
            await this.headingMyAccount.waitFor({ state: 'visible', timeout });
            return await this.headingMyAccount.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Clicks the Logout link via the My Account dropdown
     * @returns Promise<LogoutPage> - Instance of LogoutPage
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.myAccountDropdown.click();
        await this.logoutLink.click();
        return new LogoutPage(this.page);
    }

    /**
     * Enters a product name into the search field and submits search
     * @param productName - Name of the product to search
     * @returns Promise<SearchResultsPage> - Instance of SearchResultsPage
     */
    async searchProduct(productName: string): Promise<SearchResultsPage> {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
        return new SearchResultsPage(this.page);
    }
}
