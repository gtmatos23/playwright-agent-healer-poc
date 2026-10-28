import os
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent
PAGE_OBJECT = PROJECT_ROOT / "pages" / "loginPage.js"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def run_tests():
    command = "npm run test:bdd -- --retries=0 --reporter=list --timeout=10000"

    if os.name == "nt":
        return subprocess.run(
            command,
            cwd=PROJECT_ROOT,
            shell=True,
            capture_output=True,
            text=True,
        )

    return subprocess.run(
        [
            "npm",
            "run",
            "test:bdd",
            "--",
            "--retries=0",
            "--reporter=list",
            "--timeout=10000",
        ],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
    )


def remove_markdown_fences(code):
    lines = code.strip().splitlines()
    if lines and lines[0].strip().startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]
    return "\n".join(lines).strip()


def main():
    print("Executando testes Playwright/BDD...", flush=True)
    result = run_tests()

    if result.returncode == 0:
        print("Testes passaram!")
        return

    error_output = "\n".join(
        output for output in (result.stdout, result.stderr) if output
    )
    print("Os testes falharam. Saída capturada:")
    print(error_output)
    if "locator" not in error_output.lower() and "timeout" not in error_output.lower():
        raise RuntimeError(
            "A falha não parece ser de timeout/locator; nenhuma cura foi solicitada."
        )

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY não está definida. Configure-a no arquivo .env."
        )

    page_object_code = PAGE_OBJECT.read_text(encoding="utf-8")
    prompt = (
        "Você é um agente curador de QA. O teste Playwright/BDD falhou com "
        f"este erro: {error_output}. Este é o código do Page Object: "
        f"{page_object_code}. Identifique o seletor quebrado e retorne APENAS "
        "o código JavaScript completo de `pages/loginPage.js` corrigido. "
        "Troque o seletor quebrado por uma abordagem resiliente e baseada em "
        "acessibilidade suportada pelo Playwright, como "
        "`page.getByRole('button', { name: 'Entrar' })` (ou o texto que faça "
        "sentido para o botão de login). NÃO retorne marcações markdown "
        "(```javascript), apenas o código puro. Não use hard waits como "
        "`waitForTimeout`; prefira o auto-waiting do Playwright."
    )

    response = requests.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "qwen/qwen3.8-27b",
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=60,
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as error:
        raise RuntimeError(
            f"Erro retornado pela API do Groq ({response.status_code}): "
            f"{response.text}"
        ) from error

    data = response.json()
    corrected_code = remove_markdown_fences(
        data["choices"][0]["message"]["content"]
    )
    if not corrected_code:
        raise RuntimeError("A API do Groq retornou código vazio.")
    if (
        "export class LoginPage" not in corrected_code
        or "this.loginButton" not in corrected_code
    ):
        raise RuntimeError(
            "A resposta do Groq não parece conter o Page Object LoginPage completo."
        )

    PAGE_OBJECT.write_text(corrected_code + "\n", encoding="utf-8")
    print("Cura aplicada! Reexecutando testes...")

    validation = run_tests()
    if validation.stdout:
        print(validation.stdout)
    if validation.stderr:
        print(validation.stderr)
    if validation.returncode != 0:
        raise RuntimeError("Os testes ainda falharam após a cura.")

    print("Testes passaram após a cura!")


if __name__ == "__main__":
    main()