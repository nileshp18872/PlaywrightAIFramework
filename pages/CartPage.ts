import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly headingCart: Locator;
    private readonly cartItemRows: Locator;
    private readonly totalsRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingCart = page.locator('#content h1');
        this.cartItemRows = page.locator('#content form .table-responsive table tbody tr');
        this.totalsRows = page.locator('#content .row .col-sm-4.col-sm-offset-8 table tr');
    }

    /**
     * Verifies if the Shopping Cart page is displayed
     * @returns Promise<boolean> - true if shopping cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            await this.headingCart.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingCart.isVisible();
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product name displayed in the cart table
     * @param rowIndex - Zero-based row index in cart table (default: 0)
     * @returns Promise<string> - Product name
     */
    async getProductName(rowIndex: number = 0): Promise<string> {
        return (await this.cartItemRows.nth(rowIndex).locator('td:nth-child(2) a').innerText()).trim();
    }

    /**
     * Gets the product quantity displayed in the cart input
     * @param rowIndex - Zero-based row index in cart table (default: 0)
     * @returns Promise<string> - Product quantity
     */
    async getProductQuantity(rowIndex: number = 0): Promise<string> {
        return await this.cartItemRows.nth(rowIndex).locator('td:nth-child(4) input').inputValue();
    }

    /**
     * Gets the unit price for the product in the cart
     * @param rowIndex - Zero-based row index in cart table (default: 0)
     * @returns Promise<string> - Unit price text (e.g. "$602.00")
     */
    async getUnitPrice(rowIndex: number = 0): Promise<string> {
        return (await this.cartItemRows.nth(rowIndex).locator('td:nth-child(5)').innerText()).trim();
    }

    /**
     * Gets the row total price for the product in the cart
     * @param rowIndex - Zero-based row index in cart table (default: 0)
     * @returns Promise<string> - Row total price text
     */
    async getProductTotalPrice(rowIndex: number = 0): Promise<string> {
        return (await this.cartItemRows.nth(rowIndex).locator('td:nth-child(6)').innerText()).trim();
    }

    /**
     * Gets the final order total from the totals table
     * @returns Promise<string> - Total price text (e.g. "$602.00")
     */
    async getTotalPrice(): Promise<string> {
        const totalRow = this.totalsRows.filter({ hasText: 'Total:' }).last();
        return (await totalRow.locator('td').last().innerText()).trim();
    }
}
