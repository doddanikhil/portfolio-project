from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
import re

class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ('ai-trends', 'AI Trends'),
        ('technical', 'Technical Deep Dive'),
        ('industry', 'Industry Insights'),
        ('tutorial', 'Tutorial'),
        ('case-study', 'Case Study'),
        ('career', 'Career Advice'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(max_length=300, help_text="Brief description (300 chars max)")
    content = models.TextField(help_text="Full post content (Markdown supported)")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='technical')
    featured_image = CloudinaryField('image', blank=True, null=True)
    reading_time = models.IntegerField(default=5, help_text="Estimated reading time in minutes")
    published_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    
    # SEO
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    
    class Meta:
        ordering = ['-published_date']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Auto-calculate reading time (average 200 words per minute)
        if self.content:
            word_count = len(re.findall(r'\w+', self.content))
            self.reading_time = max(1, round(word_count / 200))
        
        # Auto-generate meta description from excerpt
        if not self.meta_description and self.excerpt:
            self.meta_description = self.excerpt[:160]
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    replied_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"Contact from {self.name} - {self.subject}"