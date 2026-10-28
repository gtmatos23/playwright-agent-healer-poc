# SwagLabs Playwright

Projeto de automação com Playwright + TypeScript, organizado para testes de UI e API.

## Estrutura

- `tests/ui` - testes de interface
- `tests/api` - testes de API
- `pages` - Page Objects
- `api/clients` - clientes para chamadas de API
- `api/schemas` - validações/helpers de contrato
- `fixtures` - fixtures customizadas do Playwright
- `data` - dados de teste
- `utils` - utilitários
- `features` - cenários BDD escritos em Gherkin
- `steps` - step definitions que implementam os cenários Gherkin

## Comandos

```bash
npm install
npx playwright install
npm run test:ui
npm run test:bdd
npm run test:api
npm test
npm run report
```

## BDD / Gherkin

Os cenários BDD usam `playwright-bdd` e são convertidos em testes Playwright antes da execução.

```bash
npm run bdd:generate
npm run test:bdd
```

Os arquivos `.feature` ficam em `features/`, e suas implementações ficam em `steps/`.

## Configuração

Copie `.env.example` para `.env` e ajuste `BASE_URL` e `API_URL` quando necessário.

> O teste de API de exemplo usa JSONPlaceholder para ser executável sem credenciais.
> Substitua os endpoints pelo contrato da API real do projeto.

## Demonstração do agente healer

O fluxo BDD de login foi configurado com um seletor propositalmente quebrado.
Para executar a demonstração, configure `GROQ_API_KEY` no `.env` e instale as
dependências do projeto:

```bash
npm install
npx playwright install
python -m pip install requests python-dotenv
```

Em seguida, execute os comandos da demonstração:

```bash
npm run test:bdd
python agente_healer.py
```

O primeiro comando de teste deve falhar; o agente executa o mesmo teste, envia
o erro e o Page Object ao Groq, aplica a correção retornada e valida o teste
novamente. Para manter a demonstração rápida, o agente desativa retries e usa
timeout de 10 segundos por teste durante essas execuções.
