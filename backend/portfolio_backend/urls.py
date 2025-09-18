from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("🚀 Django backend is live on Render!")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home),  # Root URL
    path("projects/", include("projects.urls")),
    path("blog/", include("portfolio_backend.blog.urls")),
    path("core/", include("portfolio_backend.core.urls")),
]
