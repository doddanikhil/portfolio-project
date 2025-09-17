# backend/projects/admin.py (REPLACE ENTIRE FILE)
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

# Custom admin styling
admin.site.site_header = "Nikhil Dodda - Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Content Management"