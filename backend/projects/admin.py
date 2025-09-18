# STEP 1: Fix backend/projects/admin.py
# Remove SiteConfiguration and CareerHighlight from this file since they're in core app

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import TechCategory, Technology, Project, ProjectDetail

@admin.register(TechCategory)
class TechCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'tech_count']
    ordering = ['name']
    
    def tech_count(self, obj):
        return obj.technology_set.count()
    tech_count.short_description = 'Technologies'

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency']
    list_filter = ['category', 'proficiency']
    list_editable = ['proficiency']
    search_fields = ['name', 'description']
    ordering = ['category__name', 'name']

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
        'demo_video_url',
    ]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_featured', 'is_published', 'has_demo', 'tech_count', 'created_at']
    list_filter = ['is_featured', 'is_published', 'technologies__category']
    list_editable = ['is_featured', 'is_published']
    search_fields = ['title', 'tagline', 'technologies__name']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['technologies']
    ordering = ['-created_at']
    inlines = [ProjectDetailInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'tagline', 'thumbnail')
        }),
        ('Content', {
            'fields': ('technologies',)
        }),
        ('Links', {
            'fields': ('github_url', 'live_demo_url')
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_published')
        }),
    )
    
    def has_demo(self, obj):
        return bool(obj.live_demo_url)
    has_demo.boolean = True
    has_demo.short_description = 'Demo'
    
    def tech_count(self, obj):
        return obj.technologies.count()
    tech_count.short_description = 'Technologies'

# Custom admin styling
admin.site.site_header = "Nikhil Dodda - Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Content Management"