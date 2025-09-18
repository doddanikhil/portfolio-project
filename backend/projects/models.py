# backend/projects/models.py
from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
import cloudinary.uploader


class TechCategory(models.Model):
    name = models.CharField(max_length=50)
    order = models.IntegerField(default=0)
    
    class Meta:
        verbose_name_plural = "Tech Categories"
        ordering = ['order']
    
    def __str__(self):
        return self.name


class Technology(models.Model):
    PROFICIENCY_CHOICES = [
        (1, 'Beginner'),
        (2, 'Intermediate'), 
        (3, 'Advanced'),
        (4, 'Expert'),
        (5, 'Master'),
    ]
    
    name = models.CharField(max_length=50)
    category = models.ForeignKey(TechCategory, on_delete=models.CASCADE)
    proficiency = models.IntegerField(choices=PROFICIENCY_CHOICES)
    icon_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#3B82F6")  # Hex color
    
    class Meta:
        verbose_name_plural = "Technologies"
        ordering = ['category__order', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_proficiency_display()})"


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    tagline = models.CharField(max_length=300, help_text="One-line description")
    thumbnail = CloudinaryField('image', null=True, blank=True)
    hero_image = CloudinaryField('image', null=True, blank=True)
    technologies = models.ManyToManyField(Technology)
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    priority = models.IntegerField(default=0, help_text="Higher number = higher priority")
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', '-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title


class ProjectDetail(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='details')
    problem_statement = models.TextField(help_text="What problem does this solve? (Markdown supported)")
    solution_approach = models.TextField(help_text="How did you solve it? (Markdown supported)")
    technology_justification = models.TextField(help_text="Why these technologies? (Markdown supported)")
    technical_architecture = CloudinaryField('image', null=True, blank=True, help_text="Architecture diagram")
    key_features = models.JSONField(default=list, help_text='["Feature 1", "Feature 2"]')
    performance_metrics = models.JSONField(default=list, help_text='[{"metric": "Latency", "improvement": "40% faster"}]')
    challenges_solved = models.TextField(blank=True, help_text="Technical challenges overcome (Markdown supported)")
    lessons_learned = models.TextField(blank=True, help_text="What you learned (Markdown supported)")
    code_snippets = models.JSONField(default=list, help_text='[{"title": "Core Algorithm", "language": "python", "code": "..."}]')
    demo_video_url = models.URLField(blank=True)
    
    def __str__(self):
        return f"Details for {self.project.title}"


class SiteConfiguration(models.Model):
    # Personal Info
    name = models.CharField(max_length=100, default="Nikhil")
    tagline = models.CharField(max_length=200, default="Applied AI Engineer")
    bio = models.TextField(default="Building intelligent applications that solve real business problems.")
    location = models.CharField(max_length=100, default="DMV Metro Area, USA")
    
    # Contact
    email = models.EmailField(default="iamdevnd@gmail.com")
    phone = models.CharField(max_length=20, blank=True)
    
    # Social Links
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    calendar_url = models.URLField(blank=True)
    resume_url = models.URLField(blank=True)
    
    # SEO
    meta_description = models.CharField(max_length=160, default="Applied AI Engineer specializing in LLM systems, RAG, and production ML applications.")
    meta_keywords = models.CharField(max_length=500, default="AI Engineer, Machine Learning, LLM, RAG, Python, AWS")
    
    # Stats
    years_experience = models.IntegerField(default=2)
    projects_completed = models.IntegerField(default=5)
    technologies_mastered = models.IntegerField(default=20)
    coffee_consumed = models.IntegerField(default=1000, help_text="Fun stat!")
    
    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"
    
    def __str__(self):
        return f"Portfolio Config - {self.name}"
    
    def save(self, *args, **kwargs):
        # Ensure only one configuration exists
        if SiteConfiguration.objects.exists() and not self.pk:
            return SiteConfiguration.objects.first()
        return super().save(*args, **kwargs)