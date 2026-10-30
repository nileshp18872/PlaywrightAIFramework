import { Page, Locator } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProduct: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;
    private readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingProduct = page.locator('#content h1');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('.alert-success');
        this.cartLink = page.locator('a[title="Shopping Cart"]');
    }

    /**
     * Verifies if the Product page is displayed
     * @returns Promise<boolean> - true if the product heading is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.headingProduct.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingProduct.isVisible();
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the displayed product name heading text
     * @returns Promise<string> - Product name
     */
    async getProductName(): Promise<string> {
        return (await this.headingProduct.innerText()).trim();
    }

    /**
     * Sets the quantity for the product
     * @param quantity - Desired quantity
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Verifies if the success alert is visible after adding to cart
     * @returns Promise<boolean> - true if success alert is visible
     */
    async isSuccessAlertVisible(): Promise<boolean> {
        try {
            await this.alertSuccess.waitFor({ state: 'visible', timeout: 5000 });
            return await this.alertSuccess.isVisible();
        } catch (error) {
            console.log(`Error waiting for add-to-cart alert: ${error}`);
            return false;
        }
    }

    /**
     * Gets the text of the add-to-cart success alert
     * @returns Promise<string> - Success alert message
     */
    async getSuccessAlertText(): Promise<string> {
        return (await this.alertSuccess.innerText()).trim();
    }

    /**
     * Navigates to the shopping cart page via header link
     * @returns Promise<CartPage> - Instance of CartPage
     */
    async clickShoppingCart(): Promise<CartPage> {
        await this.cartLink.click();
        return new CartPage(this.page);
    }
}
