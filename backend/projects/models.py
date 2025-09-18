# STEP 2: Update backend/projects/models.py
# Remove SiteConfiguration and CareerHighlight since they exist in core app

from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
import json

class TechCategory(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)  # Keep this field
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = "Tech Categories"
    
    def __str__(self):
        return self.name

class Technology(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(TechCategory, on_delete=models.CASCADE)
    proficiency = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    description = models.TextField(blank=True)
    icon_url = models.URLField(blank=True)
    
    class Meta:
        verbose_name_plural = "Technologies"
        ordering = ['category__name', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.category.name})"

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    tagline = models.CharField(max_length=300, help_text="One-line description")
    thumbnail = CloudinaryField('image', blank=True, null=True)
    technologies = models.ManyToManyField(Technology)
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
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
    technical_architecture = CloudinaryField('image', blank=True, null=True, help_text="Architecture diagram")
    key_features = models.JSONField(default=list, help_text='["Feature 1", "Feature 2"]')
    performance_metrics = models.JSONField(default=list, help_text='[{"metric": "Latency", "improvement": "40% faster"}]')
    challenges_solved = models.TextField(blank=True, help_text="Technical challenges overcome (Markdown supported)")
    demo_video_url = models.URLField(blank=True)
    lessons_learned = models.TextField(blank=True, help_text="What you learned (Markdown supported)")
    
    def __str__(self):
        return f"Details for {self.project.title}"