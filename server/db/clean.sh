#!/bin/bash

psql -U postgres -p 15432 ${DB_NAME} -f /var/ddl/data_model_ddl.sql
psql -U postgres -p 15432 ${DB_NAME} -f /var/ddl/initdata.sql
