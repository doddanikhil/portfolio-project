# backend/projects/admin.py (CORRECTED)
from django.contrib import admin
from django.utils.html import format_html
from .models import TechCategory, Technology, Project, ProjectDetail

@admin.register(TechCategory)
class TechCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'tech_count']
    list_editable = ['order']
    
    def tech_count(self, obj):
        return obj.technology_set.count()
    tech_count.short_description = "Technologies"

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'has_icon']
    list_filter = ['category', 'proficiency']
    search_fields = ['name']
    
    def has_icon(self, obj):
        return bool(obj.icon_url)
    has_icon.boolean = True

class ProjectDetailInline(admin.StackedInline):
    model = ProjectDetail
    fields = [
        'problem_statement', 
        'solution_approach', 
        'technology_justification',
        'technical_architecture',
        'key_features',
        'performance_metrics',
        'challenges_solved',
        'demo_video_url'
    ]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'title', 
        'is_featured', 
        'is_published',
        'priority', 
        'has_demo', 
        'tech_count',
        'created_at'
    ]
    list_filter = ['is_featured', 'is_published', 'technologies', 'created_at']
    list_editable = ['is_featured', 'is_published', 'priority']
    search_fields = ['title', 'tagline']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['technologies']
    inlines = [ProjectDetailInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'tagline', 'thumbnail')
        }),
        ('Links', {
            'fields': ('github_url', 'live_demo_url')
        }),
        ('Configuration', {
            'fields': ('technologies', 'priority', 'is_featured', 'is_published')
        })
    )
    
    def has_demo(self, obj):
        return bool(obj.live_demo_url)
    has_demo.boolean = True
    
    def tech_count(self, obj):
        return obj.technologies.count()
    tech_count.short_description = "Tech Stack"

# backend/portfolio_backend/core/admin.py (CREATE THIS FILE)
from django.contrib import admin
from .models import CareerHighlight, SiteConfiguration, ContactSubmission

@admin.register(CareerHighlight)
class CareerHighlightAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'date_range', 'is_current', 'order']
    list_editable = ['order', 'is_current']
    list_filter = ['is_current', 'organization']

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': ('site_name', 'tagline', 'bio', 'profile_image', 'resume_file')
        }),
        ('Contact Information', {
            'fields': ('email', 'linkedin_url', 'github_url', 'twitter_url', 'cal_com_username')
        }),
        ('SEO Settings', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        })
    )
    
    def has_add_permission(self, request):
        # Only allow one configuration
        return not SiteConfiguration.objects.exists()

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read', 'replied']
    list_filter = ['is_read', 'replied', 'created_at']
    readonly_fields = ['name', 'email', 'company', 'subject', 'message', 'created_at']
    list_editable = ['is_read', 'replied']
    
    def has_add_permission(self, request):
        return False  # Only allow viewing/editing, not adding

# backend/portfolio_backend/blog/admin.py (CORRECTED)
from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'category',
        'is_published',
        'reading_time_display',
        'views',
        'published_date'
    ]
    list_filter = ['category', 'is_published', 'published_date']
    list_editable = ['is_published']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_date'
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Metadata', {
            'fields': ('category', 'is_published')
        }),
        ('Analytics', {
            'fields': ('views',),
            'classes': ('collapse',)
        })
    )
    
    def reading_time_display(self, obj):
        return f"{obj.reading_time} min"
    reading_time_display.short_description = "Reading Time"