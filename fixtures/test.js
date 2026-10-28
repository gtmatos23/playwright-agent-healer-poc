import { test as base } from '@playwright/test';
import { UsersClient } from '../api/clients/usersClient';

export const test = base.extend({
    usersClient: async ({ request }, use) => {
        await use(new UsersClient(request));
    }
});

export { expect } from '@playwright/test';
