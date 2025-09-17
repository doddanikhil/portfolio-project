from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import BlogPost

@api_view(['GET'])
def blog_posts_list(request):
    posts = BlogPost.objects.filter(is_published=True).order_by('-published_date')
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
        })
    
    return Response(data)

@api_view(['GET'])
def blog_post_detail(request, slug):
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
        }
        
        return Response(data)
        
    except BlogPost.DoesNotExist:
        return Response({'error': 'Blog post not found'}, status=404)

@api_view(['GET'])
def blog_categories(request):
    posts = BlogPost.objects.filter(is_published=True)
    categories = {}
    
    for post in posts:
        if post.category not in categories:
            categories[post.category] = 0
        categories[post.category] += 1
    
    return Response(categories)

@api_view(['GET'])
def recent_blog_posts(request):
    posts = BlogPost.objects.filter(is_published=True).order_by('-published_date')[:3]
    data = []
    
    for post in posts:
        data.append({
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'reading_time': post.reading_time,
            'published_date': post.published_date.isoformat(),
        })
    
    return Response(data)