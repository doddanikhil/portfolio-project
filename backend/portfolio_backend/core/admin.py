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