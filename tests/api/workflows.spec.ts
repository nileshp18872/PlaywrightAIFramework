/**
 * Test Suite: FakeStore End-to-End API Workflows
 *
 * Covers:
 * 32) Product CRUD Workflow (Create -> Update -> Delete)
 * 33) User CRUD Workflow (Create -> Update -> Delete)
 * 34) Cart CRUD Workflow (Create -> Update -> Delete)
 *
 * Tags: @master @regression @e2e @api
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe.serial('End-to-End API Workflows @master @regression @api', () => {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID || 1);

    // ---------------------------------------------------------
    // Scenario 32: Product CRUD Workflow
    // ---------------------------------------------------------
    test('CRUD - Complete Product Workflow @master @regression @e2e @api', async ({ request }) => {
        let createdProductId: number;
        const newProductPayload = RandomDataUtil.generateProductPayload();

        await test.step('1) Create a product', async () => {
            const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
                data: newProductPayload,
            });

            expect(createResponse.status()).toBe(201);

            const createdBody = await createResponse.json();
            expect(createdBody).toHaveProperty('id');
            createdProductId = Number(createdBody.id);
            expect(createdProductId).toBeTruthy();
            expect(createdBody.title).toBe(newProductPayload.title);

            console.log(`Step 1: Product created with ID ${createdProductId}`);
        });

        await test.step('2) Update the same product', async () => {
            const updatePayload = {
                ...RandomDataUtil.generateUpdatedProductPayload(),
                id: createdProductId,
            };

            const updateEndpoint = Routes.UPDATE_PRODUCT.replace('{id}', String(createdProductId));
            const updateResponse = await request.put(`${BASE_URL}${updateEndpoint}`, {
                data: updatePayload,
            });

            expect(updateResponse.status()).toBe(200);

            const updatedBody = await updateResponse.json();
            expect(Number(updatedBody.id)).toBe(createdProductId);
            expect(updatedBody.title).toBe(updatePayload.title);

            console.log(`Step 2: Product ID ${createdProductId} updated successfully`);
        });

        await test.step('3) Delete the same product', async () => {
            const deleteEndpoint = Routes.DELETE_PRODUCT.replace('{id}', String(createdProductId));
            const deleteResponse = await request.delete(`${BASE_URL}${deleteEndpoint}`);

            expect(deleteResponse.status()).toBe(200);

            const deleteText = await deleteResponse.text();
            if (deleteText.trim()) {
                const deleteBody = JSON.parse(deleteText);
                expect(deleteBody).toBeTruthy();
            }

            console.log(`Step 3: Product ID ${createdProductId} deleted successfully`);
        });

        console.log('✅ Product CRUD Workflow completed successfully!');
    });

    // ---------------------------------------------------------
    // Scenario 33: User CRUD Workflow
    // ---------------------------------------------------------
    test('CRUD - Complete User Workflow @master @regression @e2e @api', async ({ request }) => {
        let createdUserId: number;
        const newUserPayload = RandomDataUtil.generateUserPayload();

        await test.step('1) Create a user', async () => {
            const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
                data: newUserPayload,
            });

            expect(createResponse.status()).toBe(201);

            const createdBody = await createResponse.json();
            expect(createdBody).toHaveProperty('id');
            createdUserId = Number(createdBody.id);
            expect(createdUserId).toBeTruthy();

            console.log(`Step 1: User created with ID ${createdUserId}`);
        });

        await test.step('2) Update the same user', async () => {
            const updatePayload = {
                ...RandomDataUtil.generateUserUpdatePayload(),
                id: createdUserId,
            };

            const updateEndpoint = Routes.UPDATE_USER.replace('{id}', String(createdUserId));
            const updateResponse = await request.put(`${BASE_URL}${updateEndpoint}`, {
                data: updatePayload,
            });

            expect(updateResponse.status()).toBe(200);

            const updatedBody = await updateResponse.json();
            if (updatedBody.id !== undefined) {
                expect(Number(updatedBody.id)).toBe(createdUserId);
            }
            expect(updatedBody.username).toBe(updatePayload.username);

            console.log(`Step 2: User ID ${createdUserId} updated successfully`);
        });

        await test.step('3) Delete the same user', async () => {
            const deleteEndpoint = Routes.DELETE_USER.replace('{id}', String(createdUserId));
            const deleteResponse = await request.delete(`${BASE_URL}${deleteEndpoint}`);

            expect(deleteResponse.status()).toBe(200);

            const deleteText = await deleteResponse.text();
            if (deleteText.trim()) {
                const deleteBody = JSON.parse(deleteText);
                expect(deleteBody).toBeTruthy();
            }

            console.log(`Step 3: User ID ${createdUserId} deleted successfully`);
        });

        console.log('✅ User CRUD Workflow completed successfully!');
    });

    // ---------------------------------------------------------
    // Scenario 34: Cart CRUD Workflow
    // ---------------------------------------------------------
    test('CRUD - Complete Cart Workflow @master @regression @e2e @api', async ({ request }) => {
        let createdCartId: number;
        const newCartPayload = RandomDataUtil.generateCartPayload(USER_ID);

        await test.step('1) Create a cart', async () => {
            const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
                data: newCartPayload,
            });

            expect(createResponse.status()).toBe(201);

            const createdBody = await createResponse.json();
            expect(createdBody).toHaveProperty('id');
            createdCartId = Number(createdBody.id);
            expect(createdCartId).toBeTruthy();
            expect(Number(createdBody.userId)).toBe(USER_ID);
            expect(Array.isArray(createdBody.products)).toBeTruthy();

            console.log(`Step 1: Cart created with ID ${createdCartId}`);
        });

        await test.step('2) Update the same cart', async () => {
            const updatePayload = {
                userId: USER_ID,
                date: RandomDataUtil.getCurrentDate(),
                products: [
                    {
                        productId: 1,
                        quantity: 99,
                    },
                ],
            };

            const updateEndpoint = Routes.UPDATE_CART.replace('{id}', String(createdCartId));
            const updateResponse = await request.put(`${BASE_URL}${updateEndpoint}`, {
                data: updatePayload,
            });

            expect(updateResponse.status()).toBe(200);

            const updatedBody = await updateResponse.json();
            expect(Number(updatedBody.id)).toBe(createdCartId);
            expect(updatedBody.products[0].quantity).toBe(99);

            console.log(`Step 2: Cart ID ${createdCartId} updated with new quantity`);
        });

        await test.step('3) Delete the same cart', async () => {
            const deleteEndpoint = Routes.DELETE_CART.replace('{id}', String(createdCartId));
            const deleteResponse = await request.delete(`${BASE_URL}${deleteEndpoint}`);

            // FakeStore returns 200 for delete; body may be null for non-persisted IDs
            expect(deleteResponse.status()).toBe(200);

            console.log(`Step 3: Cart ID ${createdCartId} deleted successfully`);
        });

        console.log('✅ Cart CRUD Workflow completed successfully!');
    });
});
