# backend/portfolio_backend/core/models.py (COMPLETE THIS FILE)
from django.db import models
from cloudinary.models import CloudinaryField
import json

class CareerHighlight(models.Model):
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=100)
    date_range = models.CharField(max_length=50)  # e.g., "Jan 2024 - Present"
    description = models.TextField(help_text="Markdown supported")
    metrics = models.JSONField(default=list, help_text="List of achievements with metrics")
    order = models.IntegerField(default=0)
    is_current = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-order', '-is_current']
    
    def __str__(self):
        return f"{self.title} at {self.organization}"

class SiteConfiguration(models.Model):
    site_name = models.CharField(max_length=100, default="Nikhil Dodda")
    tagline = models.CharField(max_length=200, default="Applied AI Engineer")
    bio = models.TextField(help_text="Main bio for about page")
    profile_image = CloudinaryField('image', folder='portfolio/profile/', blank=True)
    resume_file = CloudinaryField('file', folder='portfolio/documents/', blank=True)
    
    # Contact Information
    email = models.EmailField()
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    cal_com_username = models.CharField(max_length=50, blank=True)
    
    # SEO Meta
    meta_description = models.TextField(max_length=160)
    meta_keywords = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Site Configuration"
    
    def __str__(self):
        return self.site_name
    
    def save(self, *args, **kwargs):
        # Ensure only one configuration exists
        if not self.pk and SiteConfiguration.objects.exists():
            raise ValueError("Only one site configuration is allowed")
        super().save(*args, **kwargs)

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    replied = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Contact from {self.name} - {self.subject}"

# backend/portfolio_backend/blog/models.py (FIX MISSING IMPORT)
from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField  # ADD THIS IMPORT
import re

class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ('ai-trends', 'AI Trends'),
        ('technical', 'Technical Deep Dive'),
        ('industry', 'Industry Insights'),
        ('tutorial', 'Tutorial'),
        ('opinion', 'Opinion'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    excerpt = models.TextField(max_length=500)
    content = models.TextField(help_text="Markdown supported")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    featured_image = CloudinaryField('image', folder='portfolio/blog/', blank=True)
    reading_time = models.IntegerField(editable=False)
    published_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-published_date']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Calculate reading time (average 200 words per minute)
        word_count = len(re.findall(r'\w+', self.content))
        self.reading_time = max(1, round(word_count / 200))
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title