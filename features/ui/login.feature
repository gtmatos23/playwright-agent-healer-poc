# language: pt

Funcionalidade: Login na aplicação
  Como usuário da aplicação
  Quero autenticar minhas credenciais
  Para acessar ou receber uma mensagem de erro adequada

  Contexto:
    Dado que o usuário acessa a página de login

  Esquema do Cenário: Realizar login com usuário válido
    Quando informa o e-mail "<email>" e a senha "<senha>"
    Então deve ser redirecionado para a página administrativa
    E o título da página deve ser "<titulo>"
    E deve visualizar a mensagem de boas-vindas "Bem Vindo  <nome>"

    Exemplos:
      | email          | senha | nome             | titulo            |
      | fulano@qa.com  | teste | Fulano da Silva  | Front - ServeRest |

  Esquema do Cenário: Impedir login com credenciais inválidas
    Quando informa o e-mail "<email>" e a senha "<senha>"
    Então deve visualizar a mensagem de erro "Email e/ou senha inválidos"

    Exemplos:
      | situação           | email         | senha      |
      | usuário bloqueado  | teste@qa.com  | testehulgo |
      | usuário inválido   | teste@qa.com  | teste      |
      | senha inválida     | fulano@qa.com | testehulgo |
