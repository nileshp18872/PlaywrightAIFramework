/**
 * Test Suite: FakeStore Users API Tests
 *
 * Covers:
 * 13) Get All Users
 * 14) Get User by ID
 * 15) Get Users with Limit
 * 16) Sort Users (Ascending and Descending)
 * 17) User CRUD – Create
 * 18) User CRUD – Update
 * 19) User CRUD – Delete
 *
 * Tags: @master @sanity @regression @api
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe('Users API Tests @master @api', () => {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = process.env.USER_ID || 1;
    const LIMIT = Number(process.env.LIMIT || 3);

    // ---------------------------------------------------------
    // Scenario 13: Get All Users
    // ---------------------------------------------------------
    test('GET - All Users @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status()).toBe(200);

        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);

        // Validate important properties of first user
        const sampleUser = users[0];
        expect(sampleUser).toHaveProperty('id');
        expect(sampleUser).toHaveProperty('email');
        expect(sampleUser).toHaveProperty('username');
        expect(sampleUser).toHaveProperty('name');
        expect(sampleUser).toHaveProperty('address');

        console.log(`✅ Retrieved ${users.length} users successfully.`);
    });

    // ---------------------------------------------------------
    // Scenario 14: Get User by ID
    // ---------------------------------------------------------
    test('GET - User by ID @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const user = await response.json();
        expect(Number(user.id)).toBe(Number(USER_ID));
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('name');

        console.log(`✅ User ID ${user.id} retrieved: ${user.username}`);
    });

    // ---------------------------------------------------------
    // Scenario 15: Get Users with Limit
    // ---------------------------------------------------------
    test('GET - Users with Limit @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(LIMIT);

        console.log(`✅ Retrieved users matching limit of ${LIMIT}.`);
    });

    // ---------------------------------------------------------
    // Scenario 16: Sort Users – Ascending & Descending
    // ---------------------------------------------------------
    test('GET - Sort Users Ascending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_USERS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const users = await response.json();
        const ids: number[] = users.map((u: { id: number }) => u.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids).toEqual(sortedIds);
        console.log('✅ Verified users are sorted in ascending order by ID.');
    });

    test('GET - Sort Users Descending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_USERS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const users = await response.json();
        const ids: number[] = users.map((u: { id: number }) => u.id);
        const sortedDescIds = [...ids].sort((a, b) => b - a);

        expect(ids).toEqual(sortedDescIds);
        console.log('✅ Verified users are sorted in descending order by ID.');
    });

    // ---------------------------------------------------------
    // Scenario 17: User CRUD – Create
    // ---------------------------------------------------------
    test('POST - Create User @master @regression @api', async ({ request }) => {
        const newUser = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
            data: newUser,
        });

        expect(response.status()).toBe(201);

        const createdUser = await response.json();
        expect(createdUser.id).toBeTruthy();

        console.log(`✅ User created successfully with ID: ${createdUser.id}`);
    });

    // ---------------------------------------------------------
    // Scenario 18: User CRUD – Update
    // ---------------------------------------------------------
    test('PUT - Update User @master @regression @api', async ({ request }) => {
        const endpoint = Routes.UPDATE_USER.replace('{id}', String(USER_ID));
        const updatedUserData = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(`${BASE_URL}${endpoint}`, {
            data: updatedUserData,
        });

        expect(response.status()).toBe(200);

        const updatedUser = await response.json();
        if (updatedUser.id !== undefined) {
            expect(Number(updatedUser.id)).toBe(Number(USER_ID));
        }
        expect(updatedUser.username).toBe(updatedUserData.username);

        console.log(`✅ User ID ${USER_ID} updated successfully.`);
    });

    // ---------------------------------------------------------
    // Scenario 19: User CRUD – Delete
    // ---------------------------------------------------------
    test('DELETE - Delete User @master @regression @api', async ({ request }) => {
        const endpoint = Routes.DELETE_USER.replace('{id}', String(USER_ID));
        const response = await request.delete(`${BASE_URL}${endpoint}`);

        expect(response.status()).toBe(200);

        const deletedUser = await response.json();
        expect(Number(deletedUser.id)).toBe(Number(USER_ID));

        console.log(`✅ User ID ${USER_ID} deleted successfully.`);
    });
});
