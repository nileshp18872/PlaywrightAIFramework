import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const WEB_APP_URL = process.env.WEB_APP_URL;
if (!WEB_APP_URL) {
    throw new Error('WEB_APP_URL must be configured in .env.');
}

const ADMIN_URL = new URL(
    'admin/index.php',
    `${WEB_APP_URL.replace(/\/$/, '')}/`
).toString();

test('Register customer and verify UI, Admin, and MySQL @master @sanity @regression @db @end-to-end @e2e', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    adminCustomerPage,
}) => {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminUsername || !adminPassword) {
        throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be configured in .env.');
    }

    const customerData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail().replace('@', `-${Date.now()}@`),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(10),
    };

    try {
        await test.step('1) Register a new customer through the frontend', async () => {
            await homePage.clickMyAccount();
            await homePage.clickRegister();
            expect(await registerPage.isRegisterPageExists()).toBeTruthy();
            await registerPage.registerAccount(customerData);
        });

        await test.step('2) Verify the account-created confirmation', async () => {
            expect(await accountSuccessPage.isSuccessPageExists()).toBeTruthy();
            expect(await accountSuccessPage.getSuccessMessage()).toBe(
                'Your Account Has Been Created!'
            );
        });

        await test.step('3) Find and verify the customer in the Admin Portal', async () => {
            await adminCustomerPage.login(ADMIN_URL, adminUsername, adminPassword);
            await adminCustomerPage.openCustomers();
            await adminCustomerPage.searchByEmail(customerData.email);
            expect(await adminCustomerPage.isCustomerListed(customerData.email)).toBeTruthy();

            await adminCustomerPage.openCustomerDetails(customerData.email);
            const adminCustomer = await adminCustomerPage.getCustomerDetails();
            expect(adminCustomer.firstName).toBe(customerData.firstName);
            expect(adminCustomer.lastName).toBe(customerData.lastName);
            expect(adminCustomer.email).toBe(customerData.email);
            expect(adminCustomer.status).toBe('Enabled');
        });

        await test.step('4) Verify the customer record in MySQL', async () => {
            const dateAddedColumns = await executeQuery(
                "SHOW COLUMNS FROM oc_customer LIKE 'date_added'"
            ) as RowDataPacket[];
            const hasDateAdded = dateAddedColumns.length > 0;
            const dateAddedColumn = hasDateAdded ? ', date_added' : '';
            const customerRows = await executeQuery(
                `SELECT firstname, lastname, email, status${dateAddedColumn} FROM oc_customer WHERE email = ?`,
                [customerData.email]
            ) as RowDataPacket[];

            expect(customerRows, 'Expected exactly one matching database customer.').toHaveLength(1);

            const [customer] = customerRows;
            expect(customer.firstname, 'Database first name must match registration data.').toBe(
                customerData.firstName
            );
            expect(customer.lastname, 'Database last name must match registration data.').toBe(
                customerData.lastName
            );
            expect(customer.email, 'Database email must match registration data.').toBe(
                customerData.email
            );
            expect(Number(customer.status), 'New customer status must be enabled.').toBe(1);
            if (hasDateAdded) {
                expect(customer.date_added, 'Database date_added must be present.').toBeTruthy();
            }
        });
    } finally {
        await executeQuery('DELETE FROM oc_customer WHERE email = ?', [customerData.email]);
    }
});
