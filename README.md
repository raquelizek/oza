# OZA - Odoo Custom Platform

Plataforma customizada baseada em Odoo com módulos personalizados para gestão empresarial.

## Índice

- [Visão Geral](#visão-geral)
- [Requisitos](#requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
  - [Opção 1: Docker (Recomendado)](#opção-1-docker-recomendado)
  - [Opção 2: Instalação Local](#opção-2-instalação-local)
- [Primeira Execução](#primeira-execução)
- [Módulos Customizados](#módulos-customizados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Desenvolvimento](#desenvolvimento)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Visão Geral

O projeto OZA é uma implementação customizada do Odoo que inclui:

- **oza_branding**: Módulo de identidade visual personalizada
- **oza_seed**: Módulo de dados iniciais (usuários, projetos, tarefas)
- Configurações otimizadas para ambiente de desenvolvimento e produção

---

## Requisitos

### Requisitos Mínimos

- **Python**: 3.12+
- **PostgreSQL**: 14+
- **Docker** (opcional, mas recomendado)
- **Docker Compose** (opcional)

### Dependências do Sistema (Linux/WSL)

```bash
sudo apt update
sudo apt install -y \
  build-essential \
  python3.12-venv \
  python3-dev \
  libpq-dev \
  libxml2-dev \
  libxslt1-dev \
  libjpeg-dev \
  zlib1g-dev \
  libffi-dev \
  libev-dev
```

### Dependências Opcionais

- **wkhtmltopdf**: Para geração de relatórios em PDF

---

## Configuração do Ambiente

### Opção 1: Docker (Recomendado)

#### 1. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (ou use o existente):

```bash
# Configurações do PostgreSQL
POSTGRES_DB=odoo
POSTGRES_USER=odoo
POSTGRES_PASSWORD=odoo

# Timezone
TZ=America/Sao_Paulo
```

#### 2. Suba o banco de dados

```bash
docker compose up -d db
```

#### 3. Verifique se o banco está rodando

```bash
docker compose ps
docker compose logs db
```

### Opção 2: Instalação Local

#### 1. Instale o PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Inicie o serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Configure o banco de dados

```bash
sudo -u postgres psql

# No console do PostgreSQL:
CREATE DATABASE odoo;
CREATE USER odoo WITH PASSWORD 'odoo';
GRANT ALL PRIVILEGES ON DATABASE odoo TO odoo;
\q
```

#### 3. Configure o arquivo `config/odoo.conf`

Verifique as credenciais do banco de dados no arquivo [config/odoo.conf](config/odoo.conf).

---

## Primeira Execução

### 1. Crie o ambiente virtual Python

```bash
python3.12 -m venv venv
source venv/bin/activate
```

### 2. Instale as dependências Python

```bash
pip install -U pip wheel
pip install -r requirements.txt
```

### 3. Inicie o Odoo

```bash
./odoo-bin --addons-path="addons/,custom-addons/" -c config/odoo.conf
```

### 4. Acesse a plataforma

Abra o navegador em: [http://localhost:8069](http://localhost:8069)

**Credenciais padrão (primeira instalação):**
- Email: `admin`
- Senha: `admin` (será solicitado a alteração)

---

## Módulos Customizados

O projeto inclui dois módulos customizados em [custom-addons/](custom-addons/):

### 1. oza_branding

**Descrição**: Aplica a identidade visual OZA (logos, cores, favicon, temas)

**Recursos:**
- Customização do tema web
- Logos e ícones personalizados
- Página de login personalizada
- Favicon customizado

**Instalação**: Manual através do menu Aplicativos do Odoo

---

### 2. oza_seed

**Descrição**: Carrega dados iniciais para desenvolvimento e testes

**Dados incluídos:**
- Contatos iniciais (`res.partner.csv`)
- Projeto "OZA Onboarding" (`project.project.csv`)
- Tarefas vinculadas ao projeto (`project.task.csv`)

**Instalação**: Automática (após instalar os módulos "Contacts" e "Projects")

**Dependências:**
- Módulo `contacts`
- Módulo `project`

---

## Estrutura do Projeto

```
oza/
├── addons/                  # Módulos oficiais do Odoo
├── custom-addons/           # Módulos customizados
│   ├── oza_branding/       # Identidade visual
│   └── oza_seed/           # Dados iniciais
├── config/                  # Arquivos de configuração
│   └── odoo.conf           # Configuração principal do Odoo
├── odoo/                    # Core do Odoo
├── odoo-data/              # Dados persistentes (filestore, sessions)
├── venv/                    # Ambiente virtual Python
├── docker-compose.yml       # Configuração Docker
├── requirements.txt         # Dependências Python
├── .env                     # Variáveis de ambiente
└── README.md               # Este arquivo
```

---

## Como Usar

### Instalação dos Módulos Customizados

1. **Acesse o Odoo** em [http://localhost:8069](http://localhost:8069)

2. **Ative o modo desenvolvedor:**
   - Vá em Configurações → Ativar modo desenvolvedor

3. **Instale os módulos base necessários:**
   - Menu "Aplicativos"
   - Instale "Contacts" (Contatos)
   - Instale "Projects" (Projetos)

4. **Instale o módulo de branding:**
   - Menu "Aplicativos" → Remover filtro "Aplicativos"
   - Busque por "OZA Branding"
   - Clique em "Instalar"

5. **Verifique a instalação automática do oza_seed:**
   - Após instalar Contacts e Projects, o módulo `oza_seed` será instalado automaticamente
   - Verifique em "Aplicativos" se está marcado como instalado
   - Confira os dados em Contatos e Projetos

### Tabela de Features e Efeitos

| Feature (arquivo)        | Modelo de destino  | Módulo que carrega | O que faz                                                      |
|---------------------------|--------------------|--------------------|----------------------------------------------------------------|
| `res.partner.csv`         | `res.partner`      | `oza_seed`         | Cria contatos iniciais                                         |
| `project.project.csv`     | `project.project`  | `oza_seed`         | Cria um projeto inicial "OZA Onboarding"                       |
| `project.task.csv`        | `project.task`     | `oza_seed`         | Adiciona tarefas ligadas ao projeto OZA Onboarding             |
| Branding (`oza_branding`) | `web` (frontend)   | `oza_branding`     | Aplica identidade visual OZA (logos, cores, temas)             |

---

## Desenvolvimento

### Executar em modo desenvolvimento

```bash
source venv/bin/activate
./odoo-bin --addons-path="addons/,custom-addons/" -c config/odoo.conf --dev=all
```

O parâmetro `--dev=all` habilita:
- Auto-reload ao modificar código Python
- Logs mais detalhados
- Modo debug do frontend

### Atualizar um módulo após mudanças

```bash
./odoo-bin -c config/odoo.conf -u oza_branding,oza_seed --stop-after-init
```

Ou através da interface:
1. Menu "Aplicativos"
2. Busque o módulo
3. Clique em "Atualizar"

### Criar novo módulo customizado

```bash
./odoo-bin scaffold meu_modulo custom-addons/
```

---

## Troubleshooting

### Erro: "Could not connect to database"

**Solução:**
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env` ou [config/odoo.conf](config/odoo.conf)
- Se usar Docker: `docker compose logs db`

### Módulo não aparece na lista de aplicativos

**Solução:**
- Ative o modo desenvolvedor
- Menu "Aplicativos" → Clique em "Atualizar lista de aplicativos"
- Remova o filtro "Aplicativos" para ver todos os módulos

### Erro de permissão ao instalar dependências

**Solução:**
```bash
# Certifique-se de estar no ambiente virtual
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Odoo não carrega após mudanças

**Solução:**
```bash
# Pare o Odoo (Ctrl+C)
# Limpe cache Python
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null

# Reinicie em modo dev
./odoo-bin --addons-path="addons/,custom-addons/" -c config/odoo.conf --dev=all
```
