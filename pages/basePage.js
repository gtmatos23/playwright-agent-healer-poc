export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async acessar(url) {
        await this.page.goto(url);
    }

    mensagemDeErro() {
        return this.page.locator('.alert-dismissible > span');
    }
}
