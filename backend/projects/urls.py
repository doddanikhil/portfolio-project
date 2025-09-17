from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.api_test, name='api-test'),
    path('projects/', views.projects_list, name='projects-list'),
    path('projects/<slug:slug>/', views.project_detail, name='project-detail'),
    path('technologies/', views.technologies_list, name='technologies-list'),
    path('contact/', views.send_contact_email, name='contact'),
]