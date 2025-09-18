#!/usr/bin/env bash
# backend/build.sh - Build script for Render deployment

set -o errexit  # exit on error

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate

# Create superuser if it doesn't exist (optional)
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
"

# Load initial data
python manage.py shell < quick_setup.py || echo "Sample data script failed, continuing..."

echo "Build completed successfully!"