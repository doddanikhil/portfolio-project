# Create file: backend/use_core_models.py
# Run with: python manage.py shell < use_core_models.py

print("🚀 Creating sample data using existing core models...")

from projects.models import *
from portfolio_backend.core.models import *
from portfolio_backend.blog.models import *

# Create Site Configuration using your existing core model
if not SiteConfiguration.objects.exists():
    config = SiteConfiguration.objects.create(
        site_name="Nikhil Dodda",
        tagline="Applied AI Engineer",
        bio="Applied AI Engineer with a passion for building intelligent systems that solve real-world problems. Currently working at VS SOFT, I specialize in LLM applications, RAG systems, and production ML infrastructure.",
        email="hello@nikhildodda.dev",
        github_url="https://github.com/nikhildodda",
        linkedin_url="https://linkedin.com/in/nikhildodda",
        cal_com_username="nikhildodda",
        meta_description="Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure.",
        meta_keywords="AI Engineer, Machine Learning, LLM, RAG, Python, AWS"
    )
    print("✅ Site configuration created using core model")
else:
    print("✅ Site configuration already exists")

# Create Career Highlights using core model
highlight, created = CareerHighlight.objects.get_or_create(
    title="Applied AI Engineer",
    organization="VS SOFT",
    defaults={
        'date_range': "Jan 2024 - Present",
        'description': "Leading AI system development and optimization for enterprise clients. Improved system performance by 40% and maintained 99.9% uptime.",
        'metrics': [
            {"metric": "Performance Improvement", "value": "40%"},
            {"metric": "System Uptime", "value": "99.9%"},
            {"metric": "Client Satisfaction", "value": "95%"}
        ],
        'order': 1,
        'is_current': True
    }
)
if created:
    print("✅ Created career highlight using core model")

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
    # Check if Technology model has color field
    try:
        tech, created = Technology.objects.get_or_create(
            name=name,
            category=cat,
            defaults={'proficiency': prof}
        )
        # Try to add color if the field exists
        if hasattr(tech, 'color') and created:
            tech.color = color
            tech.save()
        if created:
            print(f"✅ Created technology: {name}")
    except Exception as e:
        print(f"⚠️  Technology {name} creation had issues: {e}")

# Create a featured project
try:
    python_tech = Technology.objects.get(name="Python") 
    django_tech = Technology.objects.get(name="Django")

    project, created = Project.objects.get_or_create(
        title="ContextCache",
        defaults={
            'tagline': "Hybrid RAG system combining vector search with graph-based reasoning",
            'is_featured': True,
            'github_url': "https://github.com/nikhildodda/contextcache",
        }
    )

    if created:
        project.technologies.add(python_tech, django_tech)
        print("✅ Created sample project")
except Exception as e:
    print(f"⚠️  Project creation had issues: {e}")

# Create sample blog post
blog1, created = BlogPost.objects.get_or_create(
    title="Building Production RAG Systems: Lessons from ContextCache",
    defaults={
        'excerpt': "A deep dive into the challenges and solutions of building RAG systems at scale.",
        'content': """# Building Production RAG Systems

Building RAG systems for production requires more than just following tutorials. Here's what I learned building ContextCache.

## The Challenge

Traditional vector search has limitations when dealing with complex document relationships.

## Our Solution

We combined:
- Vector search for semantic similarity
- Graph reasoning for relationships  
- PageRank for document importance

## Results

- 40% faster retrieval
- 60% better relevance
- Scales to 1M+ documents

The key is understanding that no single approach fits all use cases.""",
        'category': 'technical',
        'is_published': True
    }
)
if created:
    print("✅ Created sample blog post")

print("\n🎉 Sample data creation complete using existing models!")
print("📝 Next steps:")
print("1. Start your backend: python manage.py runserver")
print("2. Start your frontend: cd ../frontend && npm run dev") 
print("3. Check: http://localhost:3000")
print("4. Admin: http://127.0.0.1:8000/admin")