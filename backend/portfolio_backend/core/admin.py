# backend/portfolio_backend/core/admin.py (UPDATED)
from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import CareerHighlight, SiteConfiguration, ContactSubmission

@admin.register(CareerHighlight)
class CareerHighlightAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'date_range', 'is_current', 'order']
    list_editable = ['order', 'is_current']
    list_filter = ['is_current', 'organization']
    search_fields = ['title', 'organization', 'description']
    ordering = ['-order', '-is_current']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'organization', 'date_range', 'is_current')
        }),
        ('Content', {
            'fields': ('description', 'metrics')
        }),
        ('Display', {
            'fields': ('order',)
        })
    )

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': ('site_name', 'tagline', 'bio'),
            'description': 'Core information about you and your site'
        }),
        ('Media', {
            'fields': ('profile_image', 'resume_file', 'show_resume_download', 'custom_resume_text'),
            'description': 'Profile photo and resume file (resume is optional)',
            'classes': ('collapse',)
        }),
        ('Contact Information', {
            'fields': ('email', 'github_url', 'bluesky_handle', 'cal_com_username'),
            'description': 'Your primary contact methods and social profiles'
        }),
        ('Legacy Social (Optional)', {
            'fields': ('linkedin_url', 'twitter_url'),
            'description': 'Optional legacy social media links',
            'classes': ('collapse',)
        }),
        ('SEO & Metadata', {
            'fields': ('meta_description', 'meta_keywords'),
            'description': 'Search engine optimization settings',
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def has_add_permission(self, request):
        # Only allow one configuration
        return not SiteConfiguration.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of site config
        return False
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Add help text
        if 'bluesky_handle' in form.base_fields:
            form.base_fields['bluesky_handle'].help_text = 'Your Bluesky handle (e.g., @devdn.bsky.social)'
        if 'cal_com_username' in form.base_fields:
            form.base_fields['cal_com_username'].help_text = 'Your Cal.com username for scheduling (e.g., dnpro)'
        return form

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'company', 'created_at', 'is_read', 'replied', 'is_recent_indicator']
    list_filter = ['is_read', 'replied', 'created_at', 'company']
    search_fields = ['name', 'email', 'subject', 'message', 'company']
    readonly_fields = ['name', 'email', 'company', 'subject', 'message', 'created_at', 'ip_address', 'user_agent']
    list_editable = ['is_read', 'replied']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Contact Details', {
            'fields': ('name', 'email', 'company', 'subject')
        }),
        ('Message', {
            'fields': ('message',),
            'classes': ('wide',)
        }),
        ('Status', {
            'fields': ('is_read', 'replied')
        }),
        ('Metadata', {
            'fields': ('created_at', 'ip_address', 'user_agent'),
            'classes': ('collapse',)
        })
    )
    
    def has_add_permission(self, request):
        return False  # Only allow viewing/editing, not adding
    
    def is_recent_indicator(self, obj):
        if obj.is_recent:
            return format_html('<span style="color: #28a745; font-weight: bold;">●</span>')
        return format_html('<span style="color: #6c757d;">○</span>')
    is_recent_indicator.short_description = "Recent"
    is_recent_indicator.admin_order_field = 'created_at'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()

# Customize admin site header
admin.site.site_header = "Nikhil Dodda - Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Portfolio Content Management"