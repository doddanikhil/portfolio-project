from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import TechCategory, Technology, Project, ProjectDetail, CareerHighlight, SiteConfiguration

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
    search_fields = ['name', 'description']
    ordering = ['category__order', 'name']
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px;"></div>',
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
        'demo_video_url',
        'code_snippets'
    ]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_featured', 'is_published', 'priority', 'has_demo', 'tech_count', 'created_at']
    list_filter = ['is_featured', 'is_published', 'technologies__category']
    list_editable = ['is_featured', 'is_published', 'priority']
    search_fields = ['title', 'tagline', 'technologies__name']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['technologies']
    ordering = ['-priority', '-created_at']
    inlines = [ProjectDetailInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'tagline', 'thumbnail', 'hero_image')
        }),
        ('Content', {
            'fields': ('technologies',)
        }),
        ('Links', {
            'fields': ('github_url', 'live_demo_url')
        }),
        ('Settings', {
            'fields': ('priority', 'is_featured', 'is_published')
        }),
    )
    
    def has_demo(self, obj):
        return bool(obj.live_demo_url)
    has_demo.boolean = True
    has_demo.short_description = 'Demo'
    
    def tech_count(self, obj):
        return obj.technologies.count()
    tech_count.short_description = 'Technologies'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('technologies')

@admin.register(CareerHighlight)
class CareerHighlightAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'date_range', 'order', 'is_current']
    list_editable = ['order', 'is_current']
    filter_horizontal = ['technologies']
    ordering = ['-order']

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'tagline', 'bio', 'location', 'email')
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'github_url', 'resume_url', 'calendar_url')
        }),
        ('Media', {
            'fields': ('profile_image', 'hero_video')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords')
        }),
        ('Statistics', {
            'fields': ('years_experience', 'projects_completed', 'technologies_mastered', 'coffee_consumed')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one site configuration
        return not SiteConfiguration.objects.exists()

# Custom admin styling
admin.site.site_header = "Nikhil Dodda - Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Content Management"