import { BasePage } from './basePage';

export class UserPage extends BasePage {
    constructor(page) {
        super(page);

        this.usernameInput = page.locator('[data-testid="nome"]');
        this.emailInput = page.locator('[data-testid="email"]');
        this.passwordInput = page.locator('[data-testid="password"]');
        this.cadastroUsers = page.locator('[data-testid="cadastrarUsuario"]');
        this.checkboxAdmin = page.locator('[data-testid="checkbox"]');
        this.cadastrarButton = page.getByRole('button', { name: 'Cadastrar' });
    }

    async acessarPagina() {
        await this.acessar('admin/cadastrarusuarios');
    }

    async cadastrarUsuario(nome, email, password) {
        await this.usernameInput.fill(nome);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.checkboxAdmin.click();
        await this.cadastrarButton.click();
    }
}