# backend/projects/models.py (CORRECTED - Remove CareerHighlight)
from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
import json

class TechCategory(models.Model):
    name = models.CharField(max_length=50)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Tech Categories"
    
    def __str__(self):
        return self.name

class Technology(models.Model):
    PROFICIENCY_CHOICES = [
        (1, 'Beginner'),
        (2, 'Intermediate'),
        (3, 'Advanced'),
        (4, 'Expert'),
        (5, 'Master')
    ]
    
    name = models.CharField(max_length=50)
    category = models.ForeignKey(TechCategory, on_delete=models.CASCADE)
    proficiency = models.IntegerField(choices=PROFICIENCY_CHOICES)
    icon_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    
    class Meta:
        ordering = ['category__order', '-proficiency', 'name']
        verbose_name_plural = "Technologies"
    
    def __str__(self):
        return f"{self.name} ({self.get_proficiency_display()})"

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    tagline = models.CharField(max_length=300, help_text="One-liner description")
    thumbnail = CloudinaryField('image', folder='portfolio/projects/')
    technologies = models.ManyToManyField(Technology, blank=True)
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
    problem_statement = models.TextField(help_text="Markdown supported")
    solution_approach = models.TextField(help_text="Markdown supported")
    technology_justification = models.TextField(help_text="Why these technologies? Markdown supported")
    technical_architecture = CloudinaryField('image', folder='portfolio/architecture/', blank=True)
    key_features = models.JSONField(default=list, help_text="List of key features")
    performance_metrics = models.JSONField(default=dict, help_text="Quantifiable results as key-value pairs")
    challenges_solved = models.TextField(blank=True, help_text="Markdown supported")
    demo_video_url = models.URLField(blank=True)
    
    def __str__(self):
        return f"Details for {self.project.title}"