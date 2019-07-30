-- few SQL commands used to administrate the postgreSQL database

-- create database
CREATE DATABASE tgvmax;

-- add extension required to generate uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- create table "users"
CREATE TABLE "users" (
  id              UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  email           VARCHAR(80) NOT NULL,
  password        VARCHAR(80) NOT NULL,
  tgvmax_number   VARCHAR(11) NOT NULL,
  created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- test : insert a row in table "users"
INSERT INTO users (email, password, tgvmax_number)
    VALUES ('test@yopmail.com', 'my_password', 'HC000054321');

-- create travel status enum
CREATE TYPE status AS ENUM ('in_progress', 'found', 'not_found');

-- create table Travel
CREATE TABLE "travels" (
  id              UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  origin          VARCHAR(80) NOT NULL,
  destination     VARCHAR(80) NOT NULL,
  from_time       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  to_time         TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  status          status NOT NULL,
  last_check      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
);
