import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { SearchResultsPage } from './SearchResultsPage';
import { CartPage } from './CartPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly myAccountDropdown: Locator;
    private readonly registerLink: Locator;
    private readonly loginLink: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;
    private readonly cartLink: Locator;
    private readonly logo: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.myAccountDropdown = page.locator('a[title="My Account"]');
        this.registerLink = page.locator('#top-links').getByRole('link', { name: 'Register' });
        this.loginLink = page.locator('#top-links').getByRole('link', { name: 'Login' });
        this.txtSearch = page.locator('input[name="search"]');
        this.btnSearch = page.locator('#search button');
        this.cartLink = page.locator('a[title="Shopping Cart"]');
        this.logo = page.locator('#logo');
    }

    /**
     * Clicks the My Account dropdown menu
     */
    async clickMyAccount(): Promise<void> {
        await this.myAccountDropdown.click();
    }

    /**
     * Clicks the Register option in the My Account dropdown
     * @returns Promise<RegisterPage> - Instance of RegisterPage
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.registerLink.click();
        return new RegisterPage(this.page);
    }

    /**
     * Clicks the Login option in the My Account dropdown
     * @returns Promise<LoginPage> - Instance of LoginPage
     */
    async clickLogin(): Promise<LoginPage> {
        await this.loginLink.click();
        return new LoginPage(this.page);
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

    /**
     * Clicks the Shopping Cart link in the top header
     * @returns Promise<CartPage> - Instance of CartPage
     */
    async clickShoppingCart(): Promise<CartPage> {
        await this.cartLink.click();
        return new CartPage(this.page);
    }

    /**
     * Verifies if the Home page is displayed
     * @returns Promise<boolean> - true if the page logo is visible
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            await this.logo.waitFor({ state: 'visible', timeout: 5000 });
            return await this.logo.isVisible();
        } catch (error) {
            console.log(`Error checking home page: ${error}`);
            return false;
        }
    }
}
