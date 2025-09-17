from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import BlogPost

@api_view(['GET'])
def blog_posts_list(request):
    """Get all published blog posts"""
    category = request.GET.get('category')
    search = request.GET.get('search')
    
    posts = BlogPost.objects.filter(is_published=True)
    
    if category:
        posts = posts.filter(category=category)
    
    if search:
        posts = posts.filter(
            Q(title__icontains=search) | 
            Q(excerpt__icontains=search) |
            Q(content__icontains=search)
        )
    
    posts = posts.order_by('-published_date')
    
    data = []
    for post in posts:
        data.append({
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'category': post.category,
            'featured_image': post.featured_image.url if post.featured_image else None,
            'reading_time': post.reading_time,
            'published_date': post.published_date.isoformat(),
            'views': post.views,
            'is_featured': post.is_featured,
        })
    
    return Response(data)

@api_view(['GET'])
def blog_post_detail(request, slug):
    """Get detailed blog post"""
    try:
        post = BlogPost.objects.get(slug=slug, is_published=True)
        
        # Increment view count
        post.views += 1
        post.save(update_fields=['views'])
        
        data = {
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'content': post.content,
            'category': post.category,
            'featured_image': post.featured_image.url if post.featured_image else None,
            'reading_time': post.reading_time,
            'published_date': post.published_date.isoformat(),
            'updated_date': post.updated_date.isoformat(),
            'views': post.views,
            'meta_description': post.meta_description,
            'meta_keywords': post.meta_keywords,
        }
        
        return Response(data)
        
    except BlogPost.DoesNotExist:
        return Response({'error': 'Blog post not found'}, status=404)

@api_view(['GET'])
def recent_blog_posts(request):
    """Get recent blog posts for homepage"""
    posts = BlogPost.objects.filter(is_published=True).order_by('-published_date')[:3]
    data = []
    
    for post in posts:
        data.append({
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'category': post.category,
            'reading_time': post.reading_time,
            'published_date': post.published_date.isoformat(),
            'featured_image': post.featured_image.url if post.featured_image else None,
        })
    
    return Response(data)

@api_view(['GET'])
def blog_categories(request):
    """Get all blog categories with post counts"""
    posts = BlogPost.objects.filter(is_published=True)
    categories = {}
    
    for post in posts:
        category_display = dict(BlogPost.CATEGORY_CHOICES).get(post.category, post.category)
        if post.category not in categories:
            categories[post.category] = {
                'key': post.category,
                'name': category_display,
                'count': 0
            }
        categories[post.category]['count'] += 1
    
    return Response(list(categories.values()))