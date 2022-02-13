# Getting started

```
docker-compose up
```

# Backend

The backend is fully documented and is located at http://localhost/api/v1/docs

## Security

Generating new key to sign JWT tokens

```
openssql rand -hex 32
```

# Testing

### Jest/TS App

```
docker-compose build frontend
docker-compose run frontend npm run test
```

### Cypress e2e tests

For now run it locally so you can use cy.open, it would work in the container though..

```
# Local
npm run cypress:local
# Pipelines, prod build testing
docker-compose -f docker-compose.yml -f docker-compose.e2e.yml up --build
```

# DBA

## Migrations

### Create a migration

```
alembic revision -m "name of migration" --autogenerate
```

### Run a migration

```
alembic upgrade head
```
