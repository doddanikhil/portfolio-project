# portfolio_backend/projects/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import TechCategory, Technology, Project, ProjectDetail, CareerHighlight

@admin.register(TechCategory)
class TechCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'tech_count']
    list_editable = ['order']
    ordering = ['order', 'name']
    
    def tech_count(self, obj):
        return obj.technology_set.count()
    tech_count.short_description = 'Technologies'

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'has_icon']
    list_filter = ['category', 'proficiency']
    search_fields = ['name', 'description']
    ordering = ['category__order', '-proficiency', 'name']
    
    def has_icon(self, obj):
        return bool(obj.icon_url)
    has_icon.boolean = True

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
        'lessons_learned',
    ]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'title', 
        'is_featured', 
        'is_published', 
        'priority', 
        'has_demo', 
        'has_github',
        'tech_count',
        'created_at'
    ]
    list_filter = ['is_featured', 'is_published', 'technologies', 'created_at']
    search_fields = ['title', 'tagline']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['technologies']
    list_editable = ['is_featured', 'is_published', 'priority']
    inlines = [ProjectDetailInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'tagline', 'thumbnail')
        }),
        ('Links & Demo', {
            'fields': ('github_url', 'live_demo_url')
        }),
        ('Organization', {
            'fields': ('technologies', 'priority', 'is_featured', 'is_published')
        }),
    )
    
    def has_demo(self, obj):
        return bool(obj.live_demo_url)
    has_demo.boolean = True
    has_demo.short_description = 'Live Demo'
    
    def has_github(self, obj):
        return bool(obj.github_url)
    has_github.boolean = True
    has_github.short_description = 'GitHub'
    
    def tech_count(self, obj):
        return obj.technologies.count()
    tech_count.short_description = 'Tech Stack'
    
    def view_on_site(self, obj):
        return f"/projects/{obj.slug}/"

@admin.register(CareerHighlight)
class CareerHighlightAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'date_range', 'is_current', 'order']
    list_filter = ['is_current', 'organization']
    list_editable = ['order', 'is_current']
    ordering = ['-order', '-id']

# Custom admin styling
admin.site.site_header = "Nikhil Dodda - Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Content Management"