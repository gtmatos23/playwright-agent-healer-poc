import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
    paths: ['features/**/*.feature'],
    require: ['steps/**/*.js']
});

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : 1,
    reporter: 'html',

    // Configurações globais (aplicadas como fallback se o projeto não sobrescrever)
    use: {
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },

    projects: [
        {
            name: 'ui',
            testDir: './tests/ui',
            testMatch: /.*\.spec\.js/,
            use: {
                baseURL: process.env.BASE_URL || 'https://front.serverest.dev',
                browserName: 'chromium',
                channel: 'chrome',
                viewport: null,
                launchOptions: {
                    args: ['--start-maximized']
                }
            }
        },
        {
            name: 'api',
            testDir: './tests/api',
            testMatch: /.*\.spec\.js/,
            use: {
                // Base URL exclusiva para requisições da API
                baseURL: process.env.API_URL || 'https://serverest.dev',
                extraHTTPHeaders: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        },
        {
            name: 'bdd-ui',
            testDir: bddTestDir,
            testMatch: /.*\.spec\.js/,
            use: {
                baseURL: process.env.BASE_URL || 'https://front.serverest.dev',
                browserName: 'chromium',
                channel: 'chrome',
                viewport: null,
                launchOptions: {
                    args: ['--start-maximized']
                }
            }
        }
    ]
});