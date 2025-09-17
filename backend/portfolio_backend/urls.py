from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # API endpoints
    path("api/v1/", include("projects.urls")),  
    path("api/v1/blog/", include("portfolio_backend.blog.urls")),
    path("api/v1/core/", include("portfolio_backend.core.urls")),
]
