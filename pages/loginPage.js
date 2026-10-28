import { BasePage } from './basePage';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        this.usernameInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('.btn-login-antigo');
    }

    async acessarPagina() {
        await this.acessar('/login');
    }

    async realizarLogin(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
