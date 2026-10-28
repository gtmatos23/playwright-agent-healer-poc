import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../pages/loginPage';

const { Given, When, Then } = createBdd();

Given('que o usuário acessa a página de login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.acessarPagina();
});

When('informa o e-mail {string} e a senha {string}', async ({ page }, username, password) => {
    const loginPage = new LoginPage(page);
    await loginPage.realizarLogin(username, password);
});

Then('deve ser redirecionado para a página administrativa', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/home/);
});

Then('o título da página deve ser {string}', async ({ page }, title) => {
    await expect(page).toHaveTitle(title);
});

Then('deve visualizar a mensagem de boas-vindas {string}', async ({ page }, welcomeMessage) => {
    await expect(page.locator('h1')).toHaveText(welcomeMessage);
});

Then('deve visualizar a mensagem de erro {string}', async ({ page }, errorMessage) => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.mensagemDeErro()).toBeVisible();
    await expect(loginPage.mensagemDeErro()).toHaveText(errorMessage);
});
