# backend/portfolio_backend/core/models.py (UPDATED)
from django.db import models
from cloudinary.models import CloudinaryField

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
    tagline = models.CharField(
        max_length=200, 
        default="Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure"
    )
    bio = models.TextField(
        help_text="Main bio for about page",
        default="Applied AI Engineer with a passion for building intelligent systems that solve real-world problems. Currently working at VS SOFT, I specialize in LLM applications, RAG systems, and production ML infrastructure."
    )
    profile_image = CloudinaryField('image', folder='portfolio/profile/', blank=True)
    resume_file = CloudinaryField('file', folder='portfolio/documents/', blank=True, null=True)
    
    # Contact Information
    email = models.EmailField(default="hello@nikhildodda.dev")
    github_url = models.URLField(blank=True, help_text="Your GitHub profile URL")
    bluesky_handle = models.CharField(
        max_length=100, 
        blank=True, 
        default="@devdn.bsky.social",
        help_text="Your Bluesky handle (e.g., @username.bsky.social)"
    )
    cal_com_username = models.CharField(
        max_length=50, 
        blank=True, 
        default="dnpro",
        help_text="Your Cal.com username for scheduling"
    )
    
    # Legacy fields (kept for compatibility, but can be empty)
    linkedin_url = models.URLField(blank=True, help_text="Optional: LinkedIn profile URL")
    twitter_url = models.URLField(blank=True, help_text="Optional: Twitter/X profile URL")
    
    # SEO Meta
    meta_description = models.TextField(
        max_length=160,
        default="Applied AI Engineer specializing in production LLM systems, RAG architectures, and scalable ML infrastructure. Building intelligent applications that solve real business problems."
    )
    meta_keywords = models.CharField(
        max_length=255,
        default="AI Engineer, Machine Learning, LLM, RAG Systems, Python, AWS, MLOps, Applied AI, Nikhil Dodda"
    )
    
    # Optional fields for future features
    show_resume_download = models.BooleanField(
        default=False,
        help_text="Show resume download button (only if resume_file is uploaded)"
    )
    custom_resume_text = models.CharField(
        max_length=100,
        blank=True,
        default="Download Resume",
        help_text="Custom text for resume download button"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"
    
    def __str__(self):
        return f"Site Config: {self.site_name}"
    
    def save(self, *args, **kwargs):
        # Ensure only one configuration exists
        if not self.pk and SiteConfiguration.objects.exists():
            raise ValueError("Only one site configuration is allowed. Edit the existing one instead.")
        super().save(*args, **kwargs)
    
    @property
    def bluesky_url(self):
        """Generate Bluesky profile URL from handle"""
        if self.bluesky_handle:
            # Remove @ if present and create full URL
            handle = self.bluesky_handle.lstrip('@')
            return f"https://bsky.app/profile/{handle}"
        return ""
    
    @property
    def cal_com_url(self):
        """Generate Cal.com booking URL"""
        if self.cal_com_username:
            return f"https://cal.com/{self.cal_com_username}"
        return ""

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    replied = models.BooleanField(default=False)
    
    # Additional fields for better tracking
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"
    
    def __str__(self):
        return f"Contact from {self.name} - {self.subject} ({self.created_at.strftime('%Y-%m-%d')})"
    
    @property
    def is_recent(self):
        """Check if submission is within last 24 hours"""
        from django.utils import timezone
        from datetime import timedelta
        return self.created_at >= timezone.now() - timedelta(hours=24)