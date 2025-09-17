
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
