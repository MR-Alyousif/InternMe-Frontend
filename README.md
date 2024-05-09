# InternMe-Frontend (backend codebase)

## about us

"InternMe" is a flexible online platform designed to connect eager students with reputable companies that provide a variety of training opportunities. Whether it's summer training, internships, or cooperative programs, InternMe is the central hub for students to explore, discover, and ultimately secure their ideal training placement.

The website serves as a comprehensive database, aggregating training opportunities from a variety of industries and regions in Saudi Arabia. Students can easily navigate a wealth of options by using intuitive search filters to find positions that match their interests, skills, and training goals.

Furthermore, InternMe stands out as a locally focused platform, dedicated to providing up-to-date information on summer training, internships, and co-op opportunities within Saudi Arabia.

With InternMe, students begin on a journey of personal and professional development, gaining invaluable hands-on experience and forging long-term relationships in their chosen industry. InternMe transforms the way students approach career development by combining training opportunities and enabling them to make informed decisions, ensuring a smooth transition from the academic community to the professional world.

## Development Setup

### Prerequisites
- `.env` file (example values):
    ```.env
    API_PORT=8080
    DB_URL=mongodb://db:27017/internme
    JWT_SECRET=ddondd
    ```

- Docker
- docker-compose

### Get started

To set up the development environment, follow these steps:

1. Clone the repository: `git clone https://github.com/MR-Alyousif/internMe-frontend.git`
2. Navigate to the project directory: `cd internMe-frontend`
3. Checkout to the `backend` branch: `git checkout backend`
4. Build & run the containers: `docker-compose up --build -V` (or run `./scripts/dev.sh`)

## Files and Folder

The InternMe project (backend) follows this directory structure:
```
.
├── @types
│   └── express
├── api
│   ├── offers.ts
│   ├── profiles.ts
│   ├── users.ts
│   └── utils
├── middlewares
│   └── auth.ts
├── models
│   ├── offer.ts
│   ├── profile.ts
│   ├── user.ts
│   └── utils
├── db.ts
├── server.ts
├── package-lock.json
├── package.json
├── nginx.conf
├── docker-compose.production.yaml
├── docker-compose.yaml
├── Dockerfile
├── scripts
│   ├── dev.sh
│   ├── kill.sh
│   └── serve.sh
├── .env
├── README.md
└── tsconfig.json
```
