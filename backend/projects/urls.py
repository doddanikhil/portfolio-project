# backend/projects/urls.py
from django.urls import path
from .views import (
    ProjectListView,
    ProjectDetailView, 
    TechnologyListView,
    TechStackView,
    portfolio_stats,
    site_metadata,
    career_highlights,
    contact_submit,
    api_health
)

urlpatterns = [
    # Health check
    path('test/', api_health, name='api-health'),
    
    # Projects
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/featured/', ProjectListView.as_view(), {'featured': 'true'}, name='featured-projects'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project-detail'),
    
    # Technologies
    path('technologies/', TechnologyListView.as_view(), name='technology-list'),
    path('tech-stack/', TechStackView.as_view(), name='tech-stack'),
    
    # Site data
    path('stats/', portfolio_stats, name='portfolio-stats'),
    path('metadata/', site_metadata, name='site-metadata'),
    path('highlights/', career_highlights, name='career-highlights'),
    
    # Contact
    path('contact/', contact_submit, name='contact-submit'),
]