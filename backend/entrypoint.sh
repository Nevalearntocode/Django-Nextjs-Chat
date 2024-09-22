#!/bin/sh

# if [ "$SQL_DATABASE" = "postgres" ]
# then
#     echo "Waiting for postgres..."

#     while ! nc -z $DOCKER_SQL_HOST $DOCKER_SQL_PORT; do
#       sleep 0.1
#     done

#     echo "PostgreSQL started"
# fi

python manage.py makemigrations
python manage.py migrate

exec "$@"