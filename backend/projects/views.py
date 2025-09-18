# backend/projects/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Project, Technology, TechCategory, SiteConfiguration
from portfolio_backend.core.models import CareerHighlight, ContactSubmission
from .serializers import (
    ProjectListSerializer, 
    ProjectDetailViewSerializer,
    TechnologySerializer,
    TechCategorySerializer
)


class ProjectListView(generics.ListAPIView):
    """List all published projects with optional filtering"""
    serializer_class = ProjectListSerializer
    
    def get_queryset(self):
        queryset = Project.objects.filter(is_published=True)
        
        # Filter by featured projects
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filter by technology
        tech = self.request.query_params.get('tech', None)
        if tech:
            queryset = queryset.filter(technologies__name__icontains=tech)
        
        return queryset.distinct()


class ProjectDetailView(generics.RetrieveAPIView):
    """Get detailed view of a single project"""
    serializer_class = ProjectDetailViewSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Project.objects.filter(is_published=True)


class TechnologyListView(generics.ListAPIView):
    """List all technologies"""
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer


class TechStackView(generics.ListAPIView):
    """Get technologies grouped by category"""
    queryset = TechCategory.objects.all()
    serializer_class = TechCategorySerializer


@api_view(['GET'])
def portfolio_stats(request):
    """Portfolio statistics for homepage"""
    try:
        config = SiteConfiguration.objects.first()
        
        # Calculate dynamic stats
        total_projects = Project.objects.filter(is_published=True).count()
        featured_projects = Project.objects.filter(is_published=True, is_featured=True).count()
        technologies_count = Technology.objects.count()
        
        stats = {
            'total_projects': total_projects,
            'featured_projects': featured_projects,
            'technologies_mastered': technologies_count,
            'years_experience': config.years_experience if config else 2,
            'uptime_percentage': '99.9',  # Your reported uptime
            'performance_improvement': '40'  # Your latency improvement
        }
        
        return Response(stats)
    except Exception as e:
        return Response({
            'total_projects': 0,
            'featured_projects': 0,
            'technologies_mastered': 0,
            'years_experience': 2,
            'uptime_percentage': '99.9',
            'performance_improvement': '40'
        })


@api_view(['GET'])
def site_metadata(request):
    """Get site configuration and metadata"""
    try:
        config = SiteConfiguration.objects.first()
        if not config:
            # Return default metadata if no config exists
            return Response({
                'name': 'Nikhil Dodda',
                'tagline': 'Applied AI Engineer',
                'bio': 'Building intelligent applications that solve real business problems.',
                'location': 'DMV Metor Area, USA',
                'email': 'iamdevnd@gmail.com',
                'github_url': 'github.com/iamdevnd',
                'linkedin_url': '',
                'twitter_url': '',
                'calendar_url': '',
                'resume_url': '',
                'meta_description': 'Applied AI Engineer specializing in LLM systems, RAG, and production ML applications.',
                'meta_keywords': 'AI Engineer, Machine Learning, LLM, RAG, Python, AWS'
            })
        
        data = {
            'name': config.name,
            'tagline': config.tagline,
            'bio': config.bio,
            'location': config.location,
            'email': config.email,
            'phone': config.phone,
            'github_url': config.github_url,
            'linkedin_url': config.linkedin_url,
            'twitter_url': config.twitter_url,
            'calendar_url': config.calendar_url,
            'resume_url': config.resume_url,
            'meta_description': config.meta_description,
            'meta_keywords': config.meta_keywords,
            'years_experience': config.years_experience,
            'projects_completed': config.projects_completed,
            'technologies_mastered': config.technologies_mastered,
            'coffee_consumed': config.coffee_consumed
        }
        
        return Response(data)
    except Exception as e:
        return Response({'error': 'Failed to fetch metadata'}, status=500)


@api_view(['GET'])
def career_highlights(request):
    """Get career highlights"""
    try:
        highlights = CareerHighlight.objects.all()
        data = []
        
        for highlight in highlights:
            data.append({
                'id': highlight.id,
                'title': highlight.title,
                'organization': highlight.organization,
                'date_range': highlight.date_range,
                'description': highlight.description,
                'metrics': highlight.metrics,
                'is_current': highlight.is_current
            })
        
        return Response(data)
    except Exception as e:
        return Response([])


@api_view(['POST'])
def contact_submit(request):
    """Handle contact form submissions"""
    try:
        data = request.data
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    {'error': f'{field} is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create contact submission
        contact = ContactSubmission.objects.create(
            name=data['name'],
            email=data['email'],
            company=data.get('company', ''),
            subject=data['subject'],
            message=data['message']
        )
        
        # Send email notification (optional)
        if settings.RESEND_API_KEY:
            try:
                send_mail(
                    subject=f"Portfolio Contact: {contact.subject}",
                    message=f"From: {contact.name} <{contact.email}>\nCompany: {contact.company}\n\nMessage:\n{contact.message}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.DEFAULT_FROM_EMAIL],
                    fail_silently=True,
                )
            except Exception as email_error:
                pass  # Don't fail the API call if email fails
        
        return Response(
            {'message': 'Contact form submitted successfully'}, 
            status=status.HTTP_201_CREATED
        )
    
    except Exception as e:
        return Response(
            {'error': 'Failed to submit contact form'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def api_health(request):
    """Health check endpoint"""
    return Response({'status': 'healthy', 'message': 'Portfolio API is running'})