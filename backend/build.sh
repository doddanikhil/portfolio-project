# backend/build.sh
#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# backend/render.yaml
services:
  - type: web
    name: portfolio-backend
    runtime: python3
    buildCommand: "./build.sh"
    startCommand: "gunicorn portfolio_backend.wsgi:application"
    plan: free
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: DJANGO_SETTINGS_MODULE
        value: portfolio_backend.settings