# Create this file: backend/quick_setup.py
# Then run: python manage.py shell < quick_setup.py

print("🚀 Creating sample data...")

from projects.models import *
from portfolio_backend.blog.models import *

# Create Site Configuration (most important for fixing your site)
if not SiteConfiguration.objects.exists():
    config = SiteConfiguration.objects.create(
        name="Nikhil Dodda",
        tagline="Applied AI Engineer",
        bio="Building intelligent applications that solve real business problems.",
        location="Ashburn, Virginia", 
        email="hello@nikhildodda.dev",
        github_url="https://github.com/iamdevnd",
        linkedin_url="https://linkedin.com/in/",
        calendar_url="https://cal.com/dnpro",
        resume_url="https://iamdevnd.dev/resume.pdf"
    )
    print("✅ Site configuration created")
else:
    print("✅ Site configuration already exists")

# Create basic tech categories if they don't exist
categories = [
    ("AI/ML", 1),
    ("Backend", 2), 
    ("Frontend", 3),
    ("Cloud", 4)
]

for name, order in categories:
    cat, created = TechCategory.objects.get_or_create(
        name=name, 
        defaults={'order': order}
    )
    if created:
        print(f"✅ Created category: {name}")

# Create basic technologies
ai_cat = TechCategory.objects.get(name="AI/ML")
backend_cat = TechCategory.objects.get(name="Backend")
frontend_cat = TechCategory.objects.get(name="Frontend")

techs = [
    ("Python", ai_cat, 5, "#3776AB"),
    ("Django", backend_cat, 5, "#092E20"),
    ("React", frontend_cat, 4, "#61DAFB"),
    ("Next.js", frontend_cat, 4, "#000000"),
    ("PyTorch", ai_cat, 4, "#EE4C2C"),
]

for name, cat, prof, color in techs:
    tech, created = Technology.objects.get_or_create(
        name=name,
        category=cat,
        defaults={'proficiency': prof, 'color': color}
    )
    if created:
        print(f"✅ Created technology: {name}")

# Create a featured project
python_tech = Technology.objects.get(name="Python") 
django_tech = Technology.objects.get(name="Django")

project, created = Project.objects.get_or_create(
    title="ContextCache",
    defaults={
        'tagline': "Hybrid RAG system combining vector search with graph-based reasoning",
        'is_featured': True,
        'github_url': "https://github.com/iamdevnd/contextcache",
        'priority': 10
    }
)

if created:
    project.technologies.add(python_tech, django_tech)
    print("✅ Created sample project")

print("\n🎉 Basic sample data created!")
print("🔗 Next: Go to http://127.0.0.1:8000/admin to add more content")
print("🔗 Frontend: http://localhost:3000")