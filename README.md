# FOMMO - Music Reviews Client 🎵

> "Fear Of Missing Music Out"

Bem-vindo ao client web do **FOMMO**, uma plataforma moderna de avaliação musical inspirada no Letterboxd. Este projeto é o Front-end (SPA) desenvolvido em **Angular**, focado em oferecer uma experiência imersiva com design **Cyberpunk/Dark Glass**, consumindo a API RESTful do FOMMO.

O sistema permite descobrir lançamentos do Spotify, buscar músicas, criar avaliações e gerenciar seu perfil com uma interface fluida e responsiva.

Este projeto foi desenvolvido como parte da disciplina de Programação Web da **UNIFEI**.

---

## 📸 Screenshots

> *As imagens abaixo demonstram o fluxo de uso da aplicação.*

### 🌌 Acesso e Visão Geral
| Login / Autenticação | Dashboard: Lançamentos (Marquee) |
|:---:|:---:|
| ![Login Screen](./docs/login.png) | ![Dashboard New Releases](./docs/dashboard_newreleases.png) |
| *Entrada com identidade visual Cyberpunk* | *Carrossel infinito de novidades do Spotify* |

### 🔍 Busca e Resultados
| Busca Integrada | Perfil do Usuário |
|:---:|:---:|
| ![Search Results](./docs/dashboard_search.png) | ![User Profile](./docs/user.png) |
| *Grid de resultados com paginação manual* | *Gestão de conta e histórico pessoal* |

### ⭐ Fluxo de Avaliação
| 1. Detalhes do Álbum | 2. Criando Avaliação |
|:---:|:---:|
| ![View Details](./docs/dash_avaliacao.png) | ![New Review Form](./docs/dash_newAvaliacao.png) |
| *Visualização rica de metadados* | *Formulário com validação e nota decimal* |

| 3. Feedback (Toast) | 4. Editando Avaliação |
|:---:|:---:|
| ![Success Feedback](./docs/dash_posAvaliacoes.png) | ![Edit Review](./docs/avaliacao_editar.png) |
| *Confirmação visual da ação* | *Atualização de dados via modal* |

---

## ✨ Principais Features

### 🎨 UX & Design System
* **Estilo Cyberpunk/Glassmorphism:** Interface construída com CSS moderno, utilizando transparências, blur (`backdrop-filter`) e cores neon vibrantes (#FF0099, #00F3FF).
* **Feedback Visual:** Uso de **Toasts Notifications** personalizados para sucesso/erro e Skeletons/Spinners para estados de carregamento.

### 🚀 Arquitetura Angular Moderna
* **Standalone Components:** Projeto livre de NgModules, utilizando a abordagem moderna do Angular.
* **Angular Signals:** Gerenciamento de estado reativo e granular para performance otimizada.
* **Control Flow (@if, @for):** Utilização da nova sintaxe de templates do Angular 17+.
* **Guards & Interceptors:** Proteção de rotas (`AuthGuard`) e injeção automática de Token JWT nas requisições.

### 🎧 Funcionalidades
* **Integração Spotify:** Busca em tempo real de Álbuns, Artistas e Faixas.
* **Infinite Scroll Logic:** Implementação manual de paginação ("Load More") para carregar resultados sob demanda sem perder o estado da lista.
* **Gestão de Avaliações:** CRUD completo de avaliações via Modais interativos.
* **Perfil:** Edição de dados, alteração de senha e exclusão de conta.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** Angular 17+
* **Linguagem:** TypeScript
* **Estilização:** CSS3 (Grid, Flexbox, Animations, Variables)
* **Consumo de API:** HttpClient, RxJS
* **Gerenciamento de Estado:** Signals
* **Formulários:** Reactive Forms

---

## 🚦 Como Executar o Projeto

### 1. Pré-requisitos
* Node.js (LTS)
* Angular CLI instalado globalmente
* O **Backend do FOMMO** rodando localmente (Geralmente na porta 8080)

### 2. Instalação
```bash
# Clone o repositório
git clone [LINK_DO_SEU_REPO_FRONT]

# Entre na pasta
cd fommo-front

# Instale as dependências
npm install
```

### 3. Execução
```bash
# Inicie o servidor de desenvolvimento
ng serve
```
Acesse `http://localhost:4200/` no seu navegador.

---

## 🔗 Integração com Backend

Este projeto depende da API FOMMO para funcionar.
Acesse o repositório da API aqui: [FOMMO Backend - GitHub](https://github.com/RodolfoFariia/fommo-backend)

---

## 👨‍💻 Autores

Projeto desenvolvido por graduandos em Ciência da Computação pela **UNIFEI**:

| **Rodolfo Henrique Faria** | **Rafael Santos P. B. Leite** |
|:--------------------------:|:-----------------------------:|
| [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rodolfofaaria/) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rafael-santos-pinto-batista-leite/) |
| [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RodolfoFariia) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nottfael) |