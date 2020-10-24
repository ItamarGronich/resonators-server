module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER || "postgres",
    "password": null,
    "database": "resonators_dev",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.POSTGRES_USER || "postgres",
    "password": null,
    "database": "resonators_test",
    "host":  process.env.DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.POSTGRES_USER || "postgres",
    "password": null,
    "database": "resonators_prod",
    "host":  process.env.DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  }
}
