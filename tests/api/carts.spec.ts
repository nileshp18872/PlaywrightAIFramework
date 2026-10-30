/**
 * Test Suite: FakeStore Carts API Tests
 *
 * Covers:
 * 20) Get All Carts
 * 21) Get Cart by ID
 * 22) Get Carts by Date Range
 * 23) Get User Cart
 * 24) Get Carts with Limit
 * 25) Sort Carts (Ascending and Descending)
 * 26) Cart CRUD – Create
 * 27) Cart CRUD – Update
 * 28) Cart CRUD – Delete
 *
 * Tags: @master @sanity @regression @api
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('Carts API Tests @master @api', () => {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = process.env.CART_ID || 1;
    const USER_ID = process.env.USER_ID || 1;
    const LIMIT = Number(process.env.LIMIT || 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // Scenario 20: Get All Carts
    // ---------------------------------------------------------
    test('GET - All Carts @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBeGreaterThan(0);

        // Validate structure of first cart
        const sampleCart = carts[0];
        expect(sampleCart).toHaveProperty('id');
        expect(sampleCart).toHaveProperty('userId');
        expect(sampleCart).toHaveProperty('date');
        expect(sampleCart).toHaveProperty('products');
        expect(Array.isArray(sampleCart.products)).toBeTruthy();

        console.log(`✅ Retrieved ${carts.length} carts successfully.`);
    });

    // ---------------------------------------------------------
    // Scenario 21: Get Cart by ID
    // ---------------------------------------------------------
    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const cart = await response.json();
        expect(Number(cart.id)).toBe(Number(CART_ID));
        expect(cart).toHaveProperty('userId');
        expect(cart).toHaveProperty('products');

        console.log(`✅ Cart ID ${cart.id} retrieved successfully.`);
    });

    // ---------------------------------------------------------
    // Scenario 22: Get Carts by Date Range
    // ---------------------------------------------------------
    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE);

        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();

        const startTimestamp = new Date(START_DATE).getTime();
        const endTimestamp = new Date(END_DATE).getTime();

        carts.forEach((cart: { date: string }) => {
            const cartTimestamp = new Date(cart.date).getTime();
            expect(cartTimestamp).toBeGreaterThanOrEqual(startTimestamp);
            expect(cartTimestamp).toBeLessThanOrEqual(endTimestamp);
        });

        console.log(`✅ All ${carts.length} carts fall within date range ${START_DATE} to ${END_DATE}.`);
    });

    // ---------------------------------------------------------
    // Scenario 23: Get User Cart
    // ---------------------------------------------------------
    test('GET - User Cart @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_USER_CART.replace('{userId}', String(USER_ID));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();

        carts.forEach((cart: { userId: number }) => {
            expect(Number(cart.userId)).toBe(Number(USER_ID));
        });

        console.log(`✅ All ${carts.length} carts belong to user ID ${USER_ID}.`);
    });

    // ---------------------------------------------------------
    // Scenario 24: Get Carts with Limit
    // ---------------------------------------------------------
    test('GET - Carts with Limit @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBe(LIMIT);

        console.log(`✅ Retrieved carts matching limit of ${LIMIT}.`);
    });

    // ---------------------------------------------------------
    // Scenario 25: Sort Carts – Ascending & Descending
    // ---------------------------------------------------------
    test('GET - Sort Carts Ascending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_CARTS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();
        const ids: number[] = carts.map((c: { id: number }) => c.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids).toEqual(sortedIds);
        console.log('✅ Verified carts are sorted in ascending order by ID.');
    });

    test('GET - Sort Carts Descending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_CARTS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();
        const ids: number[] = carts.map((c: { id: number }) => c.id);
        const sortedDescIds = [...ids].sort((a, b) => b - a);

        expect(ids).toEqual(sortedDescIds);
        console.log('✅ Verified carts are sorted in descending order by ID.');
    });

    // ---------------------------------------------------------
    // Scenario 26: Cart CRUD – Create
    // ---------------------------------------------------------
    test('POST - Create Cart @master @regression @api', async ({ request }) => {
        const newCartPayload = RandomDataUtil.generateCartPayload(Number(USER_ID));

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
            data: newCartPayload,
        });

        expect(response.status()).toBe(201);

        const createdCart = await response.json();
        expect(createdCart.id).toBeTruthy();
        expect(Number(createdCart.userId)).toBe(Number(newCartPayload.userId));
        expect(Array.isArray(createdCart.products)).toBeTruthy();

        console.log(`✅ Cart created successfully with ID: ${createdCart.id}`);
    });

    // ---------------------------------------------------------
    // Scenario 27: Cart CRUD – Update
    // ---------------------------------------------------------
    test('PUT - Update Cart @master @regression @api', async ({ request }) => {
        const endpoint = Routes.UPDATE_CART.replace('{id}', String(CART_ID));
        const updatedCartPayload = {
            userId: Number(USER_ID),
            date: RandomDataUtil.getCurrentDate(),
            products: [
                {
                    productId: 1,
                    quantity: 15,
                },
            ],
        };

        const response = await request.put(`${BASE_URL}${endpoint}`, {
            data: updatedCartPayload,
        });

        expect(response.status()).toBe(200);

        const updatedCart = await response.json();
        expect(Number(updatedCart.id)).toBe(Number(CART_ID));
        expect(updatedCart.products[0].quantity).toBe(15);

        console.log(`✅ Cart ID ${CART_ID} updated with new product quantity.`);
    });

    // ---------------------------------------------------------
    // Scenario 28: Cart CRUD – Delete
    // ---------------------------------------------------------
    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {
        const endpoint = Routes.DELETE_CART.replace('{id}', String(CART_ID));
        const response = await request.delete(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const deletedCart = await response.json();
        expect(Number(deletedCart.id)).toBe(Number(CART_ID));

        console.log(`✅ Cart ID ${CART_ID} deleted successfully.`);
    });
});

