# 🛠️ Guia Prático de Demonstração: Playwright Self-Healing Agent (PoC)

Este documento fornece instruções completas para que qualquer pessoa (avaliador, colega ou desenvolvedor) configure o ambiente a partir do zero, obtenha sua própria chave de API gratuita, injete uma quebra proposital de seletor (*locator drift*) e observe o **Agente Curador Autônomo** corrigindo o código em tempo real.

---

## 1. Como Obter Sua Própria Chave de API Gratuita (Groq)

O agente curador utiliza a API do **Groq Cloud** para inferência de alta velocidade com o modelo `qwen/qwen3.8-27b`. O serviço possui camada gratuita, não exige cadastro de cartão de crédito e leva menos de 2 minutos para ser configurado.

1. Acesse o portal da [Groq Console](https://console.groq.com/).
2. Faça login com sua conta Google ou GitHub.
3. No menu lateral esquerdo, clique em **API Keys**.
4. Clique no botão **Create API Key**.
5. Dê um nome para a chave (ex: `playwright-healer-demo`), copie o token gerado (começa com `gsk_`) e guarde-o com segurança.

---

## 2. Configuração do Ambiente Local

### 2.1. Arquivo de Credenciais (`.env`)

Na raiz do projeto:

1. Crie um arquivo com o nome exato `.env` (caso ele ainda não exista).
2. Adicione sua chave de API copiada no passo anterior:

   ```env
   GROQ_API_KEY="gsk_SuaChaveAquiSemEspacos"
   ```

> **Nota de Segurança:** O arquivo `.env` já está listado no `.gitignore` e nunca deve ser compartilhado ou enviado ao repositório remoto.

### 2.2. Instalação de Dependências

Abra o terminal integrado do VS Code na raiz do projeto e execute:

```bash
# 1. Instalar dependências da automação Playwright e BDD
npm install

# 2. Garantir instalação dos binários de navegador do Playwright
npx playwright install

# 3. Instalar dependências do script orquestrador em Python
pip install requests python-dotenv
```

---

## 3. Preparando o Cenário de Teste Quebrado (Simulação de Falha)

Para demonstrar a capacidade de auto-cura, quebraremos intencionalmente o seletor do botão de confirmação de login no padrão *Page Object*.

1. Abra o arquivo `pages/loginPage.js`.
2. Localize a declaração do botão de login:
   ```javascript
   // Seletor original e funcional
   this.loginButton = page.locator('[data-testid="entrar"]');
   ```
3. Altere o seletor para uma classe CSS inexistente no DOM:
   ```javascript
   // Seletor quebrado para fins de demonstração (locator drift)
   this.loginButton = page.locator('.btn-login-antigo');
   ```
4. Salve o arquivo (`Ctrl + S`).

---

## 4. Passo 1 da Demonstração: Evidenciando a Quebra

No terminal, execute o comando de testes BDD:

```bash
npm run test:bdd
```

### O que observar:
* O Playwright tentará interagir com o seletor `.btn-login-antigo`.
* Após atingir o tempo limite de espera (*timeout* de 30s), a execução registrará falhas em vermelho (`TimeoutError: locator.click: Timeout 30000ms exceeded`).
* Isso comprova que a suíte está quebrada devido à mudança no elemento de interface.

---

## 5. Passo 2 da Demonstração: Executando a Auto-Cura

Mantenha o arquivo `pages/loginPage.js` aberto e visível em uma metade da tela, com o terminal na outra metade. No terminal, execute o agente:

```bash
python agente_healer.py
```

### O que acontece no fluxo de cura:
1. **Interceptação de Falhas:** O script dispara os testes em modo CI (silenciando servidores de relatório interativos) e captura o traceback de erro com detalhes do seletor faltante.
2. **Diagnóstico Semântico via LLM:** O script envia à API do Groq o log de erro junto ao código atual de `pages/loginPage.js`.
3. **Refatoração com Boas Práticas:** A LLM infere o propósito do botão e o substitui por um localizador de acessibilidade robusto (ex: `page.getByRole('button', { name: 'Entrar' })`), eliminando seletores frágeis e evitando pausas arbitrárias (*hard waits*).
4. **Aplicação do Patch em Tempo Real:** O script sobrescreve o arquivo `pages/loginPage.js`. Você verá o código atualizando sozinho no editor.
5. **Revalidação Automática:** O script reexecuta os testes de forma autônoma. O terminal finalizará com todos os cenários passando (verde).

---

## 6. Demonstração de Código: O Efeito da Cura (Before vs. After)

Abaixo está o trecho representativo de como o arquivo `pages/loginPage.js` se transforma durante a intervenção do agente:

### Código Quebrado (`pages/loginPage.js` antes da intervenção)

```javascript
export class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('[data-testid="email"]');
        this.passwordInput = page.locator('[data-testid="senha"]');
        
        // ❌ SELETOR FRÁGIL / QUEBRADO:
        // Causa TimeoutError pois essa classe não existe mais no DOM
        this.loginButton = page.locator('.btn-login-antigo');

        this.errorMessage = page.locator('.alert-danger');
    }

    async submitLogin(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
```

### Código Curado (`pages/loginPage.js` refatorado pelo Agente)

```javascript
export class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('[data-testid="email"]');
        this.passwordInput = page.locator('[data-testid="senha"]');
        
        // ✅ SELETOR CURADO VIA ACESSIBILIDADE (AOM):
        // Resiliente a mudanças estruturais de CSS e alinhado às diretrizes do Playwright
        this.loginButton = page.getByRole('button', { name: /entrar/i });

        this.errorMessage = page.locator('.alert-danger');
    }

    async submitLogin(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
```

### Diferença no Terminal (Output do Agente Healer)

```text
▶️ [1/3] Executando testes Playwright/BDD...
  [Playwright] 4 failed
  [Playwright] TimeoutError: locator.click: Timeout 30000ms exceeded.
  [Playwright] Call log:
  [Playwright]   - waiting for locator('.btn-login-antigo')

⚠️ Falha detectada! Analisando o erro...
🤖 [2/3] Chamando o Agente Curador no Groq (Qwen 3.8)...
✨ [loginPage.js] Arquivo curado e salvo com sucesso!

🔄 [3/3] Reexecutando os testes para validar a autocura...
  [Playwright] 4 passed (3.4s)

🎉 SUCESSO ABSOLUTO! Os testes foram curados e passaram.
```

---

## 7. Como Resetar para Uma Nova Demonstração

Para demonstrar novamente o processo a outro avaliador:

1. Abra `pages/loginPage.js`.
2. Substitua a linha de `this.loginButton` de volta para `page.locator('.btn-login-antigo');`.
3. Salve o arquivo. O ambiente estará pronto para uma nova rodada imediata.