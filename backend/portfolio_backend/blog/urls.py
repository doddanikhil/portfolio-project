from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.blog_posts_list, name='blog_posts_list'),
    path('posts/<slug:slug>/', views.blog_post_detail, name='blog_post_detail'),
    path('recent/', views.recent_blog_posts, name='recent_blog_posts'),
    path('categories/', views.blog_categories, name='blog_categories'),
]