from django.contrib import admin
from django.utils.html import format_html
from .models import BlogPost, ContactSubmission

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_published', 'is_featured', 'reading_time', 'views', 'published_date']
    list_filter = ['category', 'is_published', 'is_featured', 'published_date']
    list_editable = ['is_published', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-published_date']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Classification', {
            'fields': ('category', 'reading_time')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords')
        }),
        ('Settings', {
            'fields': ('is_published', 'is_featured')
        }),
        ('Stats', {
            'fields': ('views',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['views']

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'submitted_at', 'is_read', 'replied_at']
    list_filter = ['is_read', 'submitted_at']
    list_editable = ['is_read']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering = ['-submitted_at']
    readonly_fields = ['name', 'email', 'subject', 'message', 'submitted_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'submitted_at')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'replied_at')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ['name', 'email', 'subject', 'message']
        return self.readonly_fields