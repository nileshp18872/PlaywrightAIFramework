/**
 * Test Suite: FakeStore JSON Schema Validation Tests
 *
 * Covers:
 * 29) Product Response Schema
 * 30) User Response Schema
 * 31) Cart Response Schema
 *
 * Tags: @master @sanity @api
 */

import path from 'path';
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';

dotenv.config();

const ajv = new Ajv();

test.describe('JSON Schema Validation Tests @master @sanity @api', () => {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = process.env.PRODUCT_ID || 1;
    const USER_ID = process.env.USER_ID || 1;
    const CART_ID = process.env.CART_ID || 1;

    // ---------------------------------------------------------
    // Scenario 29: Product Response Schema
    // ---------------------------------------------------------
    test('GET - Product Response Schema Validation @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Load schema via DataProvider
        const schemaPath = path.resolve(__dirname, '../../api/schemas/product_api_schema.json');
        const productSchema = DataProvider.readJson(schemaPath);

        const validate = ajv.compile(productSchema);
        const isValid = validate(responseBody);

        expect(isValid, `Product Schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log(`✅ Product ID ${PRODUCT_ID} response conforms to JSON schema.`);
    });

    // ---------------------------------------------------------
    // Scenario 30: User Response Schema
    // ---------------------------------------------------------
    test('GET - User Response Schema Validation @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Load schema via DataProvider
        const schemaPath = path.resolve(__dirname, '../../api/schemas/user_api_schema.json');
        const userSchema = DataProvider.readJson(schemaPath);

        const validate = ajv.compile(userSchema);
        const isValid = validate(responseBody);

        expect(isValid, `User Schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log(`✅ User ID ${USER_ID} response conforms to JSON schema.`);
    });

    // ---------------------------------------------------------
    // Scenario 31: Cart Response Schema
    // ---------------------------------------------------------
    test('GET - Cart Response Schema Validation @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Load schema via DataProvider
        const schemaPath = path.resolve(__dirname, '../../api/schemas/cart_api_schema.json');
        const cartSchema = DataProvider.readJson(schemaPath);

        const validate = ajv.compile(cartSchema);
        const isValid = validate(responseBody);

        expect(isValid, `Cart Schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log(`✅ Cart ID ${CART_ID} response conforms to JSON schema.`);
    });
});

