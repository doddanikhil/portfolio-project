# backend/projects/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import TechCategory, Technology, Project, ProjectDetail, SiteConfiguration


@admin.register(TechCategory)
class TechCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'tech_count']
    list_editable = ['order']
    ordering = ['order']
    
    def tech_count(self, obj):
        return obj.technology_set.count()
    tech_count.short_description = 'Technologies'


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'color_preview']
    list_filter = ['category', 'proficiency']
    list_editable = ['proficiency']
    search_fields = ['name']
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #ccc;"></div>',
            obj.color
        )
    color_preview.short_description = 'Color'


class ProjectDetailInline(admin.StackedInline):
    model = ProjectDetail
    extra = 0
    fields = [
        'problem_statement',
        'solution_approach', 
        'technology_justification',
        'technical_architecture',
        'key_features',
        'performance_metrics',
        'challenges_solved',
        'lessons_learned',
        'code_snippets',
        'demo_video_url'
    ]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_featured', 'is_published', 'priority', 'tech_count', 'created_at']
    list_filter = ['is_featured', 'is_published', 'technologies']
    list_editable = ['is_featured', 'is_published', 'priority']
    search_fields = ['title', 'tagline']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['technologies']
    inlines = [ProjectDetailInline]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'slug', 'tagline')
        }),
        ('Media', {
            'fields': ('thumbnail', 'hero_image')
        }),
        ('Technologies & Links', {
            'fields': ('technologies', 'github_url', 'live_demo_url')
        }),
        ('Publication', {
            'fields': ('is_featured', 'is_published', 'priority')
        })
    )
    
    def tech_count(self, obj):
        return obj.technologies.count()
    tech_count.short_description = 'Tech Count'


@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'tagline', 'bio', 'location')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone')
        }),
        ('Social Links', {
            'fields': ('github_url', 'linkedin_url', 'twitter_url', 'calendar_url', 'resume_url')
        }),
        ('SEO Settings', {
            'fields': ('meta_description', 'meta_keywords')
        }),
        ('Statistics', {
            'fields': ('years_experience', 'projects_completed', 'technologies_mastered', 'coffee_consumed')
        })
    )
    
    def has_add_permission(self, request):
        # Only allow one site configuration
        return not SiteConfiguration.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of site configuration
        return False


# Customize Django Admin
admin.site.site_header = "Nikhil's Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Welcome to Portfolio Administration"