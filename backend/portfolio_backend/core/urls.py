# portfolio_backend/core/urls.py
from django.urls import path
from . import views

"""urlpatterns = [
    # example route
    path('', views.index, name='core-index'),
]"""


urlpatterns = [
    path('highlights/', views.career_highlights, name='career-highlights'),
    path('config/', views.site_config, name='site-config'),
    path('stats/', views.portfolio_stats, name='portfolio-stats'),
    path('contact/', views.send_contact_email, name='contact'),
]
