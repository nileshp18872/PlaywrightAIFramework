import { Page, Locator } from '@playwright/test';

export interface AdminCustomerDetails {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
}

export class AdminCustomerPage {
    private readonly page: Page;

    // Locators
    private readonly usernameField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;
    private readonly securityNoticeCloseButton: Locator;
    private readonly customerMenuToggle: Locator;
    private readonly emailFilter: Locator;
    private readonly filterButton: Locator;
    private readonly customerRows: Locator;
    private readonly firstNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly emailField: Locator;
    private readonly statusField: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.usernameField = page.getByLabel('Username');
        this.passwordField = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: /Login/ });
        this.securityNoticeCloseButton = page.locator('#modal-security button.close');
        this.customerMenuToggle = page.locator('#menu-customer > a');
        this.emailFilter = page.getByPlaceholder('E-Mail');
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.customerRows = page.locator('#content table tbody tr');
        this.firstNameField = page.locator('input[name="firstname"]');
        this.lastNameField = page.locator('input[name="lastname"]');
        this.emailField = page.locator('input[name="email"]');
        this.statusField = page.locator('select[name="status"]');
    }

    /**
     * Signs in to the OpenCart Admin Portal.
     * @param adminUrl - Admin Portal URL
     * @param username - Configured administrator username
     * @param password - Configured administrator password
     */
    async login(adminUrl: string, username: string, password: string): Promise<void> {
        await this.page.goto(adminUrl);
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await this.customerMenuToggle.waitFor({ state: 'visible' });

        if (await this.securityNoticeCloseButton.isVisible()) {
            await this.securityNoticeCloseButton.click();
        }
    }

    /**
     * Opens the Customers list in the Admin Portal.
     */
    async openCustomers(): Promise<void> {
        const submenuSelector = await this.customerMenuToggle.getAttribute('href');
        if (!submenuSelector?.startsWith('#')) {
            throw new Error('Could not find the Admin Portal Customers submenu.');
        }

        await this.customerMenuToggle.click();
        await this.page
            .locator(submenuSelector)
            .locator('a')
            .filter({ hasText: /^Customers$/ })
            .click();
    }

    /**
     * Filters the customer list by email address.
     * @param email - Unique customer email address
     */
    async searchByEmail(email: string): Promise<void> {
        await this.emailFilter.fill(email);
        await this.filterButton.click();
    }

    /**
     * Checks whether a customer appears in the filtered list.
     * @param email - Unique customer email address
     * @returns Promise<boolean> - true if the customer row is visible
     */
    async isCustomerListed(email: string): Promise<boolean> {
        try {
            await this.page.getByRole('cell', { name: email, exact: true }).waitFor({
                state: 'visible',
                timeout: 5000,
            });
            return true;
        } catch (error) {
            console.log(`Error checking customer row: ${error}`);
            return false;
        }
    }

    /**
     * Opens the matching customer record.
     * @param email - Unique customer email address
     */
    async openCustomerDetails(email: string): Promise<void> {
        await this.customerRows
            .filter({ has: this.page.getByRole('cell', { name: email, exact: true }) })
            .getByRole('link')
            .click();
    }

    /**
     * Reads the customer values shown in the Admin Portal record.
     * @returns Promise<AdminCustomerDetails> - Customer record values
     */
    async getCustomerDetails(): Promise<AdminCustomerDetails> {
        return {
            firstName: await this.firstNameField.inputValue(),
            lastName: await this.lastNameField.inputValue(),
            email: await this.emailField.inputValue(),
            status: await this.statusField.locator('option:checked').innerText(),
        };
    }
}
