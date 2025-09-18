# backend/portfolio_backend/blog/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import BlogPost, BlogCategory


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_published', 'reading_time', 'views', 'published_date']
    list_filter = ['category', 'is_published', 'published_date']
    list_editable = ['is_published']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['reading_time', 'views']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Classification', {
            'fields': ('category',)
        }),
        ('Publication', {
            'fields': ('is_published',)
        }),
        ('Statistics', {
            'fields': ('reading_time', 'views'),
            'classes': ('collapse',)
        })
    )
    
    def get_readonly_fields(self, request, obj=None):
        readonly = list(self.readonly_fields)
        if obj:  # editing an existing object
            readonly.extend(['published_date'])
        return readonly


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'post_count']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']
    
    def post_count(self, obj):
        return obj.post_count
    post_count.short_description = 'Posts'