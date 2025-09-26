
## Features e efeitos

| Feature (arquivo)        | Modelo de destino  | Módulo que carrega | O que faz                                                      |
|---------------------------|--------------------|--------------------|----------------------------------------------------------------|
| `res.partner.csv`         | `res.partner`      | `oza_seed`         | Cria contatos iniciais                                         |
| `project.project.csv`     | `project.project`  | `oza_seed`         | Cria um projeto inicial OZA Onboarding                         |
| `project.task.csv`        | `project.task`     | `oza_seed`         | Adiciona tarefas ligadas ao projeto OZA Onboarding             |
| Branding (`oza_branding`) | `web` (frontend)   | `oza_branding`     | Aplica identidade visual OZA (logos, cores, temas)             |



## Como usar:

1. Suba a stack:
   ```bash
   docker compose up -d --build
