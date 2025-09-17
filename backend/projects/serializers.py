# backend/projects/serializers.py
from rest_framework import serializers
from .models import TechCategory, Technology, Project, ProjectDetail

class TechnologySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Technology
        fields = ['id', 'name', 'category_name', 'proficiency', 'icon_url', 'description']

class TechCategorySerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(source='technology_set', many=True, read_only=True)
    
    class Meta:
        model = TechCategory
        fields = ['id', 'name', 'order', 'technologies']

class ProjectDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDetail
        fields = [
            'problem_statement',
            'solution_approach', 
            'technology_justification',
            'technical_architecture',
            'key_features',
            'performance_metrics',
            'challenges_solved',
            'demo_video_url'
        ]

class ProjectListSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'tagline', 'thumbnail', 
            'technologies', 'github_url', 'live_demo_url',
            'is_featured', 'created_at'
        ]

class ProjectDetailViewSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    details = ProjectDetailSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'tagline', 'thumbnail',
            'technologies', 'github_url', 'live_demo_url',
            'is_featured', 'created_at', 'updated_at', 'details'
        ]

# backend/projects/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Project, Technology, TechCategory
from .serializers import (
    ProjectListSerializer, 
    ProjectDetailViewSerializer,
    TechnologySerializer,
    TechCategorySerializer
)

class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    
    def get_queryset(self):
        queryset = Project.objects.filter(is_published=True)
        featured = self.request.query_params.get('featured', None)
        tech = self.request.query_params.get('tech', None)
        
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if tech:
            queryset = queryset.filter(technologies__name__icontains=tech)
            
        return queryset.distinct()

class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailViewSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Project.objects.filter(is_published=True)

class TechnologyListView(generics.ListAPIView):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer

class TechStackView(generics.ListAPIView):
    queryset = TechCategory.objects.all()
    serializer_class = TechCategorySerializer

@api_view(['GET'])
def portfolio_stats(request):
    """Portfolio statistics for dashboard"""
    total_projects = Project.objects.filter(is_published=True).count()
    featured_projects = Project.objects.filter(is_published=True, is_featured=True).count()
    technologies_count = Technology.objects.count()
    
    # Calculate experience (you can adjust this)
    experience_years = 2  # Based on your timeline
    
    return Response({
        'total_projects': total_projects,
        'featured_projects': featured_projects,
        'technologies_mastered': technologies_count,
        'years_experience': experience_years,
        'uptime_percentage': '99.9',  # Your reported uptime
        'performance_improvement': '40'  # Your latency improvement
    })

# backend/projects/urls.py
from django.urls import path
from .views import (
    ProjectListView,
    ProjectDetailView, 
    TechnologyListView,
    TechStackView,
    portfolio_stats
)

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project-detail'),
    path('technologies/', TechnologyListView.as_view(), name='technology-list'),
    path('tech-stack/', TechStackView.as_view(), name='tech-stack'),
    path('stats/', portfolio_stats, name='portfolio-stats'),
]

# backend/portfolio_backend/blog/serializers.py
from rest_framework import serializers
from .models import BlogPost

class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'category',
            'featured_image', 'reading_time', 'published_date', 'views'
        ]

class BlogPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'category',
            'featured_image', 'reading_time', 'published_date', 
            'updated_date', 'views'
        ]

# backend/portfolio_backend/blog/views.py
from rest_framework import generics
from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer

class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(is_published=True)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

class BlogPostDetailView(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug'
    queryset = BlogPost.objects.filter(is_published=True)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class RecentBlogPostsView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    queryset = BlogPost.objects.filter(is_published=True)[:5]

# backend/portfolio_backend/blog/urls.py
from django.urls import path
from .views import BlogPostListView, BlogPostDetailView, RecentBlogPostsView

urlpatterns = [
    path('posts/', BlogPostListView.as_view(), name='blog-list'),
    path('posts/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-detail'),
    path('recent/', RecentBlogPostsView.as_view(), name='recent-posts'),
]

# backend/portfolio_backend/core/serializers.py
from rest_framework import serializers
from .models import CareerHighlight, SiteConfiguration, ContactSubmission

class CareerHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerHighlight
        fields = ['id', 'title', 'organization', 'date_range', 'description', 'metrics', 'is_current']

class SiteConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteConfiguration
        exclude = ['created_at', 'updated_at']

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'company', 'subject', 'message']

# backend/portfolio_backend/core/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import CareerHighlight, SiteConfiguration, ContactSubmission
from .serializers import (
    CareerHighlightSerializer,
    SiteConfigurationSerializer, 
    ContactSubmissionSerializer
)

class CareerHighlightListView(generics.ListAPIView):
    queryset = CareerHighlight.objects.all()
    serializer_class = CareerHighlightSerializer

class SiteConfigurationView(generics.RetrieveAPIView):
    serializer_class = SiteConfigurationSerializer
    
    def get_object(self):
        return SiteConfiguration.objects.first()

@api_view(['POST'])
def contact_submit(request):
    """Handle contact form submissions"""
    serializer = ContactSubmissionSerializer(data=request.data)
    
    if serializer.is_valid():
        contact = serializer.save()
        
        # Send email notification (optional)
        try:
            send_mail(
                subject=f"Portfolio Contact: {contact.subject}",
                message=f"From: {contact.name} <{contact.email}>\nCompany: {contact.company}\n\nMessage:\n{contact.message}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['your-email@example.com'],
                fail_silently=True,
            )
        except Exception as e:
            pass  # Don't fail the API call if email fails
        
        return Response(
            {'message': 'Contact form submitted successfully'}, 
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# backend/portfolio_backend/core/urls.py
from django.urls import path
from .views import CareerHighlightListView, SiteConfigurationView, contact_submit

urlpatterns = [
    path('highlights/', CareerHighlightListView.as_view(), name='career-highlights'),
    path('config/', SiteConfigurationView.as_view(), name='site-config'),
    path('contact/', contact_submit, name='contact-submit'),
]