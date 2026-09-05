#!/usr/bin/env sh
set -eu

if [ "${DATABASE_URL:-}" != "" ]; then
  case "$DATABASE_URL" in
    postgres://*|postgresql://*)
      db_url="${DATABASE_URL#postgres://}"
      db_url="${db_url#postgresql://}"
      db_host_path="${db_url#*@}"
      export DATABASE_URL="jdbc:postgresql://${db_host_path}"
      ;;
  esac
fi

exec java -jar app.jar
