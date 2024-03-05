# Clini Med Center

Bem-vindo ao Clini Med Center! Este projeto oferece uma solução completa para a gestão de consultas e exames em uma clínica de saúde. Desenvolvido utilizando Next.js, PostgreSQL, Prisma ORM, e diversas tecnologias modernas.

[Link para Aplicação](https://clini-med-center.vercel.app/)

## Como Subir o Projeto

1. Clone este repositório:

```bash
git clone https://github.com/HenriqueSydney/clini-med-center.git
```

2. Acesse a pasta do projeto:
```bash
cd clini-med-center
```

3. Instale as dependências:
```bash
npm install
```

4. Configure o arquivo de ambiente .env com suas variáveis de ambiente.
O arquivo env.example demonstra as variáveis necessárias. 
Para configurar e obter as variáveis referentes ao Google Provider, sigas as orientações do Next Auth: [Next Auth - Google Provider](https://next-auth.js.org/providers/google)

5. Verifique as configurações do docker-compose.yml, especificadamente, quanto a porta destinada a o Postgres e ajuste, se for o caso, a variável DATABASE_URL do .env.
**Atenção** Para testar a funcionalidade de criação de profissionais e exames, é necessário configurar a variável de ambiente ADMIN_EMAIL do .env, com seu email do gmail.

6. Execute o docker-compose.yml
```bash
sudo docker-compose up
```
7. Configure o prisma. Atualize o Model prisma > schema.prisma (projeto está configurado para publicação na Vercel):
```JavaScript
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

8. Execute as migrations do Prisma:
```bash
npm run prisma:sync
```

9. Execute o projeto:
```bash
npm run dev
```

Agora, o Clini Med Center estará rodando localmente em http://localhost:3000. Acesse este endereço no seu navegador para começar a explorar a aplicação.


Tenha uma ótima experiência com o Clini Med Center!


## Visão Geral

O Clini Med Center é uma aplicação que possibilita o registro de profissionais e exames, pesquisa por profissionais e exames, consulta de informações sobre um profissional ou exame, cadastramento de agendamentos, consulta de agendamentos, edição e cancelamento de agendamentos. 

## Funcionalidades Principais

### Landing Page

Apresenta as principais informações da clínica, dando aos pacientes uma visão geral dos serviços oferecidos.

### Consulta de Profissionais

Lista os profissionais disponíveis na clínica, permitindo aos usuários filtrar por especialidade e buscar por nome.

### Consulta de Informações sobre um Profissional

Fornece detalhes sobre um profissional específico, incluindo suas especialidades e informações relevantes.


### Formulário de Agendamento de Consulta

Permite que os pacientes agendem consultas e exames, selecionando a especialidade, o profissional e escolhendo datas disponíveis.

### Pesquisa dos Agendamentos Realizados

Facilita a pesquisa de agendamentos realizados, permitindo aos pacientes visualizar suas consultas anteriores.

### Cancelamento de Agendamento

Possibilita o cancelamento de agendamentos por meio da identificação do paciente via CPF.

## Requisitos Funcionais

- **Landing Page:**
  - Contém informações principais da clínica.

- **Consulta de Profissionais:**
  - Permite filtrar por especialidade e pesquisar por nome.

- **Consulta de Informações sobre um Profissional:**
  - Apresenta detalhes do profissional selecionado.

- **Formulário de Agendamento de Consulta:**
  - Possibilita o agendamento de consultas e exames.
  - **Restrição de Agendamento:**
     - Não é possível agendar uma consulta com um profissional que não está disponível.
     - Não é possível agendar uma consulta no mesmo horário já agendado para o mesmo paciente.
     - Não deve ser possível agendar consulta em horário incompatível com o funcionamento da clínica.

- **Pesquisa dos Agendamentos Realizados:**
  - Facilita a busca por consultas anteriores.

- **Cancelamento de Agendamento:**
  - Permite o cancelamento de agendamentos.

## Requisitos Não Funcionais

- **Configuração do Projeto:**
  - Projeto Next.js, com banco PostgreSQL, ORM Prisma, e dependências.

- **Criação de componentes:**
  - Criação dos componentes e funcionalidades que serão utilizadas para construção da aplicação.
    - Componentes de estrutura: Header, Footer, Modal;
    - Componentes de formulário: InputText, Textarea, Select, Fieldset, FileInput;
    - Componentes visuais e interativos: Toast, Slider, Buttons;

- **Configuração de Login:**
  - Configurar Next Auth com Google Provider.

- **Armazenamento de Informações:** 
  - Relação de profissionais e agendamentos em um SGBD relacional (Postgres).

- **Cadastro de Profissionais:**
  - Administradores podem cadastrar a relação de profissionais.

- **Restrição de Agendamento:**
    - Deve-se estar logado para realizar uma agendamento.

## Backlogs sugestivos de ampliação do projeto
- **Vinculação com Google Agenda ou outro aplicativo de Agenda**
- **Funcionalidade de Avaliação da Consulta**
- **Integração com API de avaliações do Google**
- **Funcionalidade para que o Médico ou Responsável pelo Exame inclua informações sobre a consulta (como prescrição e outros. Necessidade de Criptografia)**
- **Integração com CMS para atualização de dados relacionados à Clínica**
- **Criação de uma espécie de Blog de Notícia, com integração com CMS**


## Observação

Projeto criado em decorrência da Disciplina Programação e Desenvolvimento WEB, da faculdade de Análise e Desenvolvimento de Sistemas do UniCeub. A sistematização assim solicitou:

Uma clínica oferece diversos serviços de saúde, desde atendimento médico, exames laboratoriais e de imagem, aconselhamento nutricional, entre outros procedimentos. Recentemente houve uma mudança na administração da clínica e os novos gestores decidiram reformular todas as soluções de tecnologia da empresa a fim de melhorar a experiência dos pacientes. Para isso, a clínica contratou a empresa onde você trabalha para desenvolver as soluções a seguir:


**Projeto 01** - Uma landing page estática apresentando as principais informações da clínica, bem como seus principais serviços.

**Projeto 02**- Uma API para acesso à disponibilidade dos profissionais de saúde. Uma vez acionada, essa aplicação consultaria um arquivo local (XML ou JSON) e obteria as especialidades e os respectivos profissionais, permitindo filtros por especialidade e pesquisa por nome.

**Projeto 03** - Uma aplicação para marcação de consultas/exames. Essa aplicação deve ser composta por frontend e backend e permitir que o usuário selecione a especialidade e o profissional. Serão apresentadas as datas disponíveis para que o usuário selecione a informe seus dados (Nome e CPF) para efetivar o agendamento. Deve ser possível pesquisar agendamento por CPF e eventualmente cancelá-lo. A consulta e armazenamento das informações deverá ocorrer em arquivos (XML ou JSON) no servidor de backend.

**Projeto 04** - A mesma aplicação objeto do Projeto 03, porém com gerenciamento dos dados em banco de dados (PostgreSQL ou MySQL) e cuja infraestrutura seja instanciada por meio de containers.

**Atenção:** Todas os projetos foram executados, no entanto, com adaptação quanto à forma de armazenamento das informações, que utilizaram para todos os dados o banco de dados PostgreSQL.
