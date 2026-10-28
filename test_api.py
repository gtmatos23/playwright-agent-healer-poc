import os
import requests
from dotenv import load_dotenv

load_dotenv()
groq_key = os.getenv("GROQ_API_KEY")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {groq_key}",
    "Content-Type": "application/json"
}

payload = {
    # Usando um dos modelos listados na sua conta, excelente para código!
    "model": "qwen/qwen3.8-27b", 
    "messages": [
        {"role": "user", "content": "Responda em uma palavra: Funcionou?"}
    ]
}

print("Enviando requisição para a API do Groq...")

try:
    response = requests.post(url, headers=headers, json=payload, timeout=15)
    
    if response.status_code == 200:
        dados = response.json()
        texto_resposta = dados['choices'][0]['message']['content']
        print(f"✅ SUCESSO! A IA respondeu: {texto_resposta.strip()}")
    else:
        print(f"❌ Erro da API (Status {response.status_code}):")
        print(response.text)
        
except Exception as e:
    print(f"❌ Erro: {e}")