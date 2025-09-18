# backend/portfolio_backend/core/models.py
from django.db import models
from cloudinary.models import CloudinaryField


class CareerHighlight(models.Model):
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=100)
    date_range = models.CharField(max_length=50)  # e.g., "2023 - Present"
    description = models.TextField()
    metrics = models.JSONField(default=list, help_text='["40% performance improvement", "99.9% uptime"]')
    is_current = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-is_current', '-order', '-id']
    
    def __str__(self):
        return f"{self.title} at {self.organization}"


class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"Contact from {self.name} - {self.subject}"


class SiteConfiguration(models.Model):
    # Personal Info
    name = models.CharField(max_length=100, default="Nikhil Dodda")
    tagline = models.CharField(max_length=200, default="Applied AI Engineer")
    bio = models.TextField(default="Building intelligent applications that solve real business problems.")
    location = models.CharField(max_length=100, default=" DMV Metro Area, USA")
    
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
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
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