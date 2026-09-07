#!/usr/bin/env sh
set -eu

if [ "${DATABASE_URL:-}" != "" ]; then
  case "$DATABASE_URL" in
    postgres://*|postgresql://*)
      db_url="${DATABASE_URL#postgres://}"
      db_url="${db_url#postgresql://}"
      if [ "${db_url#*@}" != "$db_url" ]; then
        db_credentials="${db_url%%@*}"
        db_host_path="${db_url#*@}"
        if [ "${db_credentials#*:}" != "$db_credentials" ]; then
          export DATABASE_USERNAME="${DATABASE_USERNAME:-${db_credentials%%:*}}"
          export DATABASE_PASSWORD="${DATABASE_PASSWORD:-${db_credentials#*:}}"
        else
          export DATABASE_USERNAME="${DATABASE_USERNAME:-$db_credentials}"
        fi
      else
        db_host_path="$db_url"
      fi
      export DATABASE_URL="jdbc:postgresql://${db_host_path}"
      ;;
  esac
fi

exec java -jar app.jar
