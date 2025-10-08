
> **Requisitos mínimos:** **Python 3.12+** e PostgreSQL 14+ (pode ser via Docker).

## Pré-requisitos

- **Python 3.12+**
- **PostgreSQL 14+**
  - Pode ser local **ou** via Docker:
    ```bash
    docker compose up -d db
    # verifique credenciais no docker-compose.yml (POSTGRES_USER/PASSWORD)
    ```
- **Build tools** (Ubuntu/WSL):
  ```bash
  sudo apt update
  sudo apt install -y build-essential python3.12-venv python3-dev libpq-dev libxml2-dev libxslt1-dev libjpeg-dev zlib1g-dev libffi-dev libev-dev
  ```
- *(Opcional)* **wkhtmltopdf** para relatórios em PDF.

## Primeira execução

1. **Ambiente Python**
   ```bash
   python3.12 -m venv .venv
   source venv/bin/activate
   pip install -U pip wheel
   # pip install -r requirements.txt
   ```

2. **Inicialização (sem dados de demonstração, pt_BR)**
   ```bash
   ./odoo-bin --addons-path="addons/" -c config/odoo.conf
   ```

## Features e efeitos

| Feature (arquivo)        | Modelo de destino  | Módulo que carrega | O que faz                                                      |
|---------------------------|--------------------|--------------------|----------------------------------------------------------------|
| `res.partner.csv`         | `res.partner`      | `oza_seed`         | Cria contatos iniciais                                         |
| `project.project.csv`     | `project.project`  | `oza_seed`         | Cria um projeto inicial OZA Onboarding                         |
| `project.task.csv`        | `project.task`     | `oza_seed`         | Adiciona tarefas ligadas ao projeto OZA Onboarding             |
| Branding (`oza_branding`) | `web` (frontend)   | `oza_branding`     | Aplica identidade visual OZA (logos, cores, temas)             |

## Como usar:

 <h3>Suba a stack:</h3>

   ```bash
   docker compose up -d --build
  ```

 <h3>Dentro da plataforma:</h3> 

  - Dentro da plataforma temos dois modulos: "oza_branding" e "oza_seed"
  - Até o momento, o "oza_branding" precisa ser instalado manualmente.
  - O "oza_seed" é instalado automaticamente incluindo os dados solicitados(usuários, tarefas e projeto). Porém, ele depende do módulo
    "Contacts" e "Projects". Para que funcine, instale os módulos "Contatcs" e "Projects" e o "oza_seed" irá incluir os dados automaticamente.

