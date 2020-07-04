# Webstore for La Resistace Media
Allows to purchase digital assets with a credit card and download material stored in S3.

Technology
Express, React, Stripe, styled components, bootstrap, Amazon S3, Postgres, Heroku

**Setup**
1. Run `yarn install` in the main directory and in the `/client` directory. This last one is the front end application.

2. Create an `.env` file in both the main directory and the `/client` directory. Fill in the env variables in the respectve `.env.sample` files.

3. Install postgres and run the init.sql file, as well as the other sql files in the `sql_files` dir.

Use this tutorial as a reference (locally and on heroku):

https://www.taniarascia.com/node-express-postgresql-heroku/

4. Setup and S3 bucket, upload the files, and fill in the backend `.env` file with the credentials.

5. Run locally with
`$ npm run dev` on root directory
`$ npm run start` on `/client` directory

6. Deploy to heroku
6.1 Setup heroku account and CLI
6.2 Setup postgres on Heroku
6.3 Run sql commands on production to create tables

**Useful commands**

*Login to heroku db*
`heroku pg:psql postgresql-random-heroku-name --app your-app-name`

*Setting up remote heroku on a new mac*
`heroku git:remote -a project`

*Run sql file on production (examples)*
`cat init.sql | heroku pg:psql postgresql-random-heroku-name --app your-app-name`

`cat sql_files/add_transactions_table.sql | heroku pg:psql postgresql-encircled-81059 --app your-app-name`

