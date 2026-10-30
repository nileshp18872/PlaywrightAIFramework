/**
 * Test Suite: FakeStore Products API Tests
 *
 * Covers:
 * 3) Get All Products
 * 4) Get Product by ID
 * 5) Get Products with Limit
 * 6) Sort Products – Ascending
 * 7) Sort Products – Descending
 * 8) Get All Product Categories
 * 9) Get Products by Category
 * 10) Product CRUD – Create
 * 11) Product CRUD – Update
 * 12) Product CRUD – Delete
 *
 * Tags: @master @sanity @regression @api
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('Products API Tests @master @api', () => {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = process.env.PRODUCT_ID || 1;
    const LIMIT = Number(process.env.LIMIT || 3);

    // ---------------------------------------------------------
    // Scenario 3: Get All Products
    // ---------------------------------------------------------
    test('GET - All Products @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        // Validate important fields for sample products
        const sampleProduct = products[0];
        expect(sampleProduct).toHaveProperty('id');
        expect(sampleProduct).toHaveProperty('title');
        expect(sampleProduct).toHaveProperty('price');
        expect(sampleProduct).toHaveProperty('category');
        expect(sampleProduct).toHaveProperty('image');

        console.log(`✅ Retrieved ${products.length} products successfully.`);
    });

    // ---------------------------------------------------------
    // Scenario 4: Get Product by ID
    // ---------------------------------------------------------
    test('GET - Product by ID @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const product = await response.json();
        expect(product.id).toBe(Number(PRODUCT_ID));
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');

        console.log(`✅ Product ID ${product.id} retrieved: "${product.title}"`);
    });

    // ---------------------------------------------------------
    // Scenario 5: Get Products with Limit
    // ---------------------------------------------------------
    test('GET - Products with Limit @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBe(LIMIT);

        console.log(`✅ Retrieved products matching limit of ${LIMIT}.`);
    });

    // ---------------------------------------------------------
    // Scenario 6: Sort Products – Ascending
    // ---------------------------------------------------------
    test('GET - Sort Products Ascending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const products = await response.json();
        const ids: number[] = products.map((item: { id: number }) => item.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids).toEqual(sortedIds);
        console.log('✅ Verified products are sorted in ascending order by ID.');
    });

    // ---------------------------------------------------------
    // Scenario 7: Sort Products – Descending
    // ---------------------------------------------------------
    test('GET - Sort Products Descending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const products = await response.json();
        const ids: number[] = products.map((item: { id: number }) => item.id);
        const sortedDescIds = [...ids].sort((a, b) => b - a);

        expect(ids).toEqual(sortedDescIds);
        console.log('✅ Verified products are sorted in descending order by ID.');
    });

    // ---------------------------------------------------------
    // Scenario 8: Get All Product Categories
    // ---------------------------------------------------------
    test('GET - All Product Categories @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status()).toBe(200);

        const categories = await response.json();
        expect(Array.isArray(categories)).toBeTruthy();
        expect(categories.length).toBeGreaterThan(0);
        expect(categories).toContain('electronics');

        console.log(`✅ Retrieved ${categories.length} categories: [${categories.join(', ')}]`);
    });

    // ---------------------------------------------------------
    // Scenario 9: Get Products by Category
    // ---------------------------------------------------------
    test('GET - Products by Category @master @regression @api', async ({ request }) => {
        const targetCategory = 'electronics';
        const endpoint = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', targetCategory);
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        products.forEach((product: { category: string }) => {
            expect(product.category.toLowerCase()).toBe(targetCategory.toLowerCase());
        });

        console.log(`✅ All ${products.length} returned products belong to category "${targetCategory}".`);
    });

    // ---------------------------------------------------------
    // Scenario 10: Product CRUD – Create
    // ---------------------------------------------------------
    test('POST - Create Product @master @regression @api', async ({ request }) => {
        const newProduct = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
            data: newProduct,
        });

        expect(response.status()).toBe(201);

        const createdProduct = await response.json();
        expect(createdProduct.id).toBeTruthy();
        expect(createdProduct.title).toBe(newProduct.title);
        expect(createdProduct.price).toBe(newProduct.price);

        console.log(`✅ Product created with ID: ${createdProduct.id}`);
    });

    // ---------------------------------------------------------
    // Scenario 11: Product CRUD – Update
    // ---------------------------------------------------------
    test('PUT - Update Product @master @regression @api', async ({ request }) => {
        const endpoint = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));
        const updatedData = RandomDataUtil.generateUpdatedProductPayload();

        const response = await request.put(`${BASE_URL}${endpoint}`, {
            data: updatedData,
        });

        expect(response.status()).toBe(200);

        const updatedProduct = await response.json();
        expect(Number(updatedProduct.id)).toBe(Number(PRODUCT_ID));
        expect(updatedProduct.title).toBe(updatedData.title);

        console.log(`✅ Product ID ${PRODUCT_ID} updated successfully.`);
    });

    // ---------------------------------------------------------
    // Scenario 12: Product CRUD – Delete
    // ---------------------------------------------------------
    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {
        const endpoint = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));
        const response = await request.delete(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const deletedProduct = await response.json();
        expect(Number(deletedProduct.id)).toBe(Number(PRODUCT_ID));

        console.log(`✅ Product ID ${PRODUCT_ID} deleted successfully.`);
    });
});

