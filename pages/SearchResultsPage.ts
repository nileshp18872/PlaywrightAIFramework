import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly headingSearch: Locator;
    private readonly productLayouts: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingSearch = page.locator('#content h1');
        this.productLayouts = page.locator('#content .product-layout');
    }

    /**
     * Verifies if the Search Results page is displayed
     * @returns Promise<boolean> - true if the search heading is visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.headingSearch.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingSearch.isVisible();
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Checks if a specific product appears in the search results
     * @param productName - Name of the product
     * @returns Promise<boolean> - true if the product link is visible
     */
    async isProductVisible(productName: string): Promise<boolean> {
        try {
            const product = this.productLayouts.locator('.caption h4 a').filter({ hasText: productName }).first();
            return await product.isVisible();
        } catch (error) {
            console.log(`Error verifying product ${productName} in search results: ${error}`);
            return false;
        }
    }

    /**
     * Clicks on the specified product name to open its details page
     * @param productName - Name of the product to select
     * @returns Promise<ProductPage> - Instance of ProductPage
     */
    async selectProduct(productName: string): Promise<ProductPage> {
        const product = this.productLayouts.locator('.caption h4 a').filter({ hasText: productName }).first();
        await product.click();
        return new ProductPage(this.page);
    }
}
