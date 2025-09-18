# backend/portfolio_backend/blog/models.py
from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
import re
import math


class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ('ai-trends', 'AI Trends'),
        ('technical', 'Technical Deep Dive'),
        ('industry', 'Industry Insights'),
        ('tutorial', 'Tutorial'),
        ('opinion', 'Opinion'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    excerpt = models.TextField(max_length=500)
    content = models.TextField(help_text="Markdown supported")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    featured_image = CloudinaryField('image', blank=True)
    reading_time = models.IntegerField(editable=False)  # Auto-calculated
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
        self.reading_time = max(1, math.ceil(word_count / 200))
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title


class BlogCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Blog Categories"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def post_count(self):
        return BlogPost.objects.filter(category=self.slug, is_published=True).count()