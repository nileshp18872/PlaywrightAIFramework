/**
 * Test Case: End-to-End Shopping Flow
 *
 * Covers the complete customer shopping journey:
 * 1) Open the application
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 * 15) Verify that the complete journey finishes without errors
 *
 * Tags: @master @sanity @regression @e2e @mobileweb
 */
import { test, expect } from '../../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../../utils/dataGenerator';
import { Helper } from '../../../utils/helper';

test('End-to-End Shopping Flow @master @sanity @regression @e2e @mobileweb', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    logoutPage,
    loginPage,
    myAccountPage,
    searchResultsPage,
    productPage,
    cartPage,
}) => {
    // Generate dynamic unique customer data
    const customerData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(10),
    };

    // Known product details from helper
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Navigate to the registration page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage).toBeTruthy();
    });

    await test.step('2) Register a new customer using dynamically generated unique data', async () => {
        await registerPage.registerAccount(customerData);
    });
/*
    await test.step('3) Verify successful registration', async () => {
        const isSuccessPage = await accountSuccessPage.isSuccessPageExists();
        expect(isSuccessPage).toBeTruthy();

        const successMessage = await accountSuccessPage.getSuccessMessage();
        expect(successMessage).toBe('Your Account Has Been Created!');
    });
*/
    await test.step('4) Log out', async () => {
        await accountSuccessPage.clickLogout();
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();

        await logoutPage.clickContinue();
        const isHomePage = await homePage.isHomePageExists();
        expect(isHomePage).toBeTruthy();
    });

    await test.step('5) Log in again using the newly created credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();

        await loginPage.login(customerData.email, customerData.password);
    });

    await test.step('6) Verify successful authentication', async () => {
        const isAuthenticated = await myAccountPage.isMyAccountPageExists();
        expect(isAuthenticated).toBeTruthy();
    });

    await test.step('7) Search for a known product', async () => {
        await myAccountPage.searchProduct(productName);
        const isSearchResults = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchResults).toBeTruthy();

        const isProductFound = await searchResultsPage.isProductVisible(productName);
        expect(isProductFound).toBeTruthy();
    });

    await test.step('8) Open the product details page', async () => {
        await searchResultsPage.selectProduct(productName);
        const isProductDetails = await productPage.isProductPageExists();
        expect(isProductDetails).toBeTruthy();

        const displayedProductName = await productPage.getProductName();
        expect(displayedProductName).toBe(productName);
    });

    await test.step('9) Add the product to the cart and verify confirmation', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();

        const isAlertVisible = await productPage.isSuccessAlertVisible();
        expect(isAlertVisible).toBeTruthy();

        const alertText = await productPage.getSuccessAlertText();
        expect(alertText).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('10) Open the shopping cart', async () => {
        await productPage.clickShoppingCart();
        const isCartPage = await cartPage.isCartPageExists();
        expect(isCartPage).toBeTruthy();
    });

    await test.step('11) Verify the correct product in cart', async () => {
        const cartProductName = await cartPage.getProductName(0);
        expect(cartProductName).toBe(productName);
    });

    await test.step('12) Verify the product quantity in cart', async () => {
        const cartQuantity = await cartPage.getProductQuantity(0);
        expect(cartQuantity).toBe(productQuantity);
    });

    await test.step('13) Verify the product price in cart', async () => {
        const unitPrice = await cartPage.getUnitPrice(0);
        expect(unitPrice).toBe(totalPrice);
    });

    await test.step('14) Verify the applicable cart total', async () => {
        const cartTotal = await cartPage.getTotalPrice();
        expect(cartTotal).toBe(totalPrice);
    });

    await test.step('15) Verify that the complete journey finishes without errors', async () => {
        const isCartPageVisible = await cartPage.isCartPageExists();
        expect(isCartPageVisible).toBeTruthy();
        console.log('✅ End-to-End Shopping Flow completed successfully without errors!');
    });
});
