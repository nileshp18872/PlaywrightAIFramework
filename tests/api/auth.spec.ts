/**
 * Test Suite: FakeStore Authentication API Tests
 *
 * Covers:
 * 1) Successful Login with valid credentials
 * 2) Invalid Login with rejected credentials
 *
 * Tags: @master @sanity @regression @api
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe('Authentication API Tests @master @api', () => {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USERNAME = process.env.USERNAME && process.env.USERNAME !== '91989' ? process.env.USERNAME : 'mor_2314';
    const PASSWORD = process.env.PASSWORD || '83r5^_';

    // ---------------------------------------------------------
    // Scenario 1: Successful Login
    // ---------------------------------------------------------
    test('POST - Successful Login @master @sanity @api', async ({ request }) => {
        const payload = {
            username: USERNAME,
            password: PASSWORD,
        };

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: payload,
        });

        // Verify status code 201 (or 200)
        expect([200, 201]).toContain(response.status());

        const responseBody = await response.json();

        // Verify token exists and is a non-empty string
        expect(responseBody).toHaveProperty('token');
        expect(typeof responseBody.token).toBe('string');
        expect(responseBody.token.trim().length).toBeGreaterThan(0);

        console.log('✅ Successful Login test completed. Token received successfully!');
    });

    // ---------------------------------------------------------
    // Scenario 2: Invalid Login
    // ---------------------------------------------------------
    test('POST - Invalid Login @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: payload,
        });

        // Verify status code 401
        expect(response.status()).toBe(401);

        const responseText = (await response.text()).trim();

        // Verify error message
        expect(responseText).toContain('username or password is incorrect');

        console.log('✅ Invalid Login test completed with expected 401 error message!');
    });
});
