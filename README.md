# Система управління завданнями (Task Management API)
**Автор:** Іванов Олександр, група КБ 5/24

## 🎯 Особливості проєкту
*   **ООП Підхід:** Використання паттернів Dependency Injection, Data Mapper та Decorators.
*   **Гнучкість СУБД:** Завдяки TypeORM та Docker, система підтримує роботу з MySQL, PostgreSQL та іншими СУБД без зміни коду.
*   **Безпека:** Хешування паролів (bcrypt) та авторизація через JWT.
*   **Документація:** Автоматична генерація Swagger UI.

## 🚀 Запуск проєкту
1. **Встановлення залежностей:** `npm install`
2. **Налаштування:** Створіть файл `.env` на основі `.env.example`.
3. **БД:** Запустіть контейнер `docker-compose up -d`.
4. **Міграції:** `npm run typeorm migration:run -- -d dist/database/data-source.js`
5. **Запуск:** `npm run start:dev`

## 📚 API Документація
Доступна за адресою: http://localhost:3000/api/docs
```
task-manager-api
├─ .prettierignore
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.controller.ts
│  │  ├─ auth.module.ts
│  │  ├─ auth.service.ts
│  │  ├─ dto
│  │  │  ├─ login.dto.ts
│  │  │  └─ register.dto.ts
│  │  ├─ jwt-auth.guard.ts
│  │  └─ jwt.strategy.ts
│  ├─ data-source.ts
│  ├─ database
│  │  ├─ database.config.ts
│  │  └─ database.module.ts
│  ├─ main.ts
│  ├─ migrations
│  │  └─ 1777813318687-InitialSchema.ts
│  ├─ projects
│  │  ├─ projects.entity.ts
│  │  ├─ projects.module.ts
│  │  └─ projects.service.ts
│  ├─ tasks
│  │  ├─ dto
│  │  │  ├─ create-task.dto.ts
│  │  │  └─ update-task.dto.ts
│  │  ├─ tasks.controller.ts
│  │  ├─ tasks.entity.ts
│  │  ├─ tasks.module.ts
│  │  └─ tasks.service.ts
│  └─ users
│     ├─ users.entity.ts
│     ├─ users.module.ts
│     └─ users.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  ├─ global-setup.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json