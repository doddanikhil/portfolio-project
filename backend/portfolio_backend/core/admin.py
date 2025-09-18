# backend/portfolio_backend/core/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import CareerHighlight, ContactSubmission, SiteConfiguration


@admin.register(CareerHighlight)
class CareerHighlightAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'date_range', 'is_current', 'order']
    list_filter = ['is_current', 'organization']
    list_editable = ['is_current', 'order']
    search_fields = ['title', 'organization', 'description']
    ordering = ['-is_current', '-order']


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'company', 'submitted_at', 'is_read']
    list_filter = ['is_read', 'submitted_at']
    list_editable = ['is_read']
    search_fields = ['name', 'email', 'subject', 'company']
    readonly_fields = ['submitted_at']
    ordering = ['-submitted_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'company')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'submitted_at')
        })
    )


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