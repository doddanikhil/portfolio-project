from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.blog_posts_list, name='blog-posts-list'),
    path('posts/<slug:slug>/', views.blog_post_detail, name='blog-post-detail'),
    path('categories/', views.blog_categories, name='blog-categories'),
    path('recent/', views.recent_blog_posts, name='recent-blog-posts'),
]
