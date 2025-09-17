from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.api_test, name='api_test'),
    path('projects/', views.projects_list, name='projects_list'),
    path('projects/featured/', views.featured_projects, name='featured_projects'),
    path('projects/<slug:slug>/', views.project_detail, name='project_detail'),
    path('tech-stack/', views.tech_stack, name='tech_stack'),
    path('highlights/', views.career_highlights, name='career_highlights'),
    path('metadata/', views.site_metadata, name='site_metadata'),
    path('stats/', views.site_stats, name='site_stats'),
    path('contact/', views.contact_submit, name='contact_submit'),
    
    # Legacy URLs for compatibility
    path('technologies/', views.technologies_list, name='technologies_list'),
]