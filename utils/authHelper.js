import { expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { users } from '../data/login';

export async function loginValido(page) {
    const loginPage = new LoginPage(page);

    await loginPage.acessarPagina();
    await loginPage.realizarLogin(
        users.usuarioValido.username,
        users.usuarioValido.password
    );

    await expect(page).toHaveURL(/\/admin\/home/);
    await expect(page).toHaveTitle('Front - ServeRest');
}