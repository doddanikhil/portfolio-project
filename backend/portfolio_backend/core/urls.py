# portfolio_backend/core/urls.py
from django.urls import path
from . import views

"""urlpatterns = [
    # example route
    path('', views.index, name='core-index'),
]"""


urlpatterns = [
    path('contact/', views.send_contact_email, name='send-contact-email'),
]