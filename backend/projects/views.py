# STEP 1: Update backend/projects/views.py to use core models
# Replace the imports and use your existing core models

from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q, Sum
from .models import Project, Technology, TechCategory
# Use core models instead of duplicating
from portfolio_backend.core.models import CareerHighlight, SiteConfiguration, ContactSubmission
from portfolio_backend.blog.models import BlogPost
import resend
import os

# Configure Resend API key from settings/environment (no hardcoded default)
resend.api_key = os.getenv("RESEND_API_KEY", "")
if not resend.api_key:
    # In production, prefer proper logging; keeping simple raise to avoid silent misconfig
    raise RuntimeError("RESEND_API_KEY is not set. Configure it in your environment.")


@api_view(['GET'])
def api_test(request):
    return Response({
        'message': 'Portfolio API is working!',
        'version': '2.0',
        'status': 'healthy',
        'endpoints': [
            '/api/v1/test/',
            '/api/v1/projects/',
            '/api/v1/projects/featured/',
            '/api/v1/projects/<slug>/',
            '/api/v1/tech-stack/',
            '/api/v1/highlights/',
            '/api/v1/metadata/',
            '/api/v1/stats/',
            '/api/v1/blog/posts/',
            '/api/v1/blog/recent/',
            '/api/v1/contact/',
        ]
    })

@api_view(['GET'])
def projects_list(request):
    """Get all published projects"""
    projects = Project.objects.filter(is_published=True)
    data = []
    
    for project in projects:
        technologies = []
        for tech in project.technologies.all():
            technologies.append({
                'name': tech.name,
                'category': tech.category.name,
                'color': getattr(tech, 'color', '#3B82F6')  # Safe access
            })
        
        data.append({
            'title': project.title,
            'slug': project.slug,
            'tagline': project.tagline,
            'thumbnail': project.thumbnail.url if project.thumbnail else None,
            'hero_image': getattr(project, 'hero_image', None),
            'is_featured': project.is_featured,
            'github_url': project.github_url,
            'live_demo_url': project.live_demo_url,
            'technologies': technologies,
            'created_at': project.created_at.isoformat(),
            'priority': getattr(project, 'priority', 0)
        })
    
    return Response(data)

@api_view(['GET'])
def featured_projects(request):
    """Get only featured projects"""
    projects = Project.objects.filter(is_published=True, is_featured=True)[:3]
    data = []
    
    for project in projects:
        technologies = []
        for tech in project.technologies.all():
            technologies.append({
                'name': tech.name,
                'category': tech.category.name,
                'color': getattr(tech, 'color', '#3B82F6')
            })
        
        data.append({
            'title': project.title,
            'slug': project.slug,
            'tagline': project.tagline,
            'thumbnail': project.thumbnail.url if project.thumbnail else None,
            'technologies': technologies,
            'github_url': project.github_url,
            'live_demo_url': project.live_demo_url,
            'created_at': project.created_at.isoformat(),
        })
    
    return Response(data)

@api_view(['GET'])
def project_detail(request, slug):
    """Get detailed project information"""
    try:
        project = Project.objects.get(slug=slug, is_published=True)
        
        technologies = []
        for tech in project.technologies.all():
            technologies.append({
                'name': tech.name,
                'category': tech.category.name,
                'proficiency': tech.proficiency,
                'icon_url': tech.icon_url,
                'description': tech.description,
                'color': getattr(tech, 'color', '#3B82F6')
            })
        
        # Get project details if available
        details = None
        if hasattr(project, 'details'):
            details = {
                'problem_statement': project.details.problem_statement,
                'solution_approach': project.details.solution_approach,
                'technology_justification': project.details.technology_justification,
                'technical_architecture': project.details.technical_architecture.url if project.details.technical_architecture else None,
                'key_features': project.details.key_features,
                'performance_metrics': project.details.performance_metrics,
                'challenges_solved': project.details.challenges_solved,
                'demo_video_url': project.details.demo_video_url,
                'lessons_learned': getattr(project.details, 'lessons_learned', ''),
                'code_snippets': getattr(project.details, 'code_snippets', []),
            }
        
        data = {
            'title': project.title,
            'slug': project.slug,
            'tagline': project.tagline,
            'thumbnail': project.thumbnail.url if project.thumbnail else None,
            'hero_image': getattr(project, 'hero_image', None),
            'technologies': technologies,
            'github_url': project.github_url,
            'live_demo_url': project.live_demo_url,
            'is_featured': project.is_featured,
            'created_at': project.created_at.isoformat(),
            'updated_at': project.updated_at.isoformat(),
            'details': details
        }
        
        return Response(data)
        
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)

@api_view(['GET'])
def tech_stack(request):
    """Get technologies grouped by category"""
    categories = TechCategory.objects.all()
    data = []
    
    for category in categories:
        technologies = []
        for tech in category.technology_set.all():
            technologies.append({
                'name': tech.name,
                'proficiency': tech.proficiency,
                'description': tech.description,
                'icon_url': tech.icon_url,
                'color': getattr(tech, 'color', '#3B82F6')
            })
        
        if technologies:
            data.append({
                'category': category.name,
                'order': getattr(category, 'order', 0),
                'technologies': technologies
            })
    
    return Response(data)

@api_view(['GET'])
def career_highlights(request):
    """Get career highlights from core app"""
    highlights = CareerHighlight.objects.all().order_by('-order')
    data = []
    
    for highlight in highlights:
        data.append({
            'title': highlight.title,
            'organization': highlight.organization,
            'date_range': highlight.date_range,
            'description': highlight.description,
            'metrics': highlight.metrics,
            'order': getattr(highlight, 'order', 0),
            'is_current': getattr(highlight, 'is_current', False)
        })
    
    return Response(data)

@api_view(['GET'])
def site_metadata(request):
    """Get site configuration from core app"""
    try:
        config = SiteConfiguration.objects.first()
        if not config:
            return Response({
                'name': 'Nikhil Dodda',
                'tagline': 'Applied AI Engineer',
                'bio': 'Building intelligent applications that solve real business problems.',
                'location': 'Ashburn, Virginia',
                'email': 'hello@nikhildodda.dev',
                'linkedin_url': '',
                'github_url': '',
                'resume_url': '',
                'calendar_url': '',
                'profile_image': None,
                'hero_video': None,
                'meta_description': 'Applied AI Engineer specializing in production LLM systems.',
                'meta_keywords': 'AI Engineer, Machine Learning, LLM, RAG, Python, AWS',
            })
        
        data = {
            'name': getattr(config, 'site_name', 'Nikhil Dodda'),
            'tagline': config.tagline,
            'bio': config.bio,
            'location': getattr(config, 'location', 'Ashburn, Virginia'),
            'email': config.email,
            'linkedin_url': getattr(config, 'linkedin_url', ''),
            'github_url': config.github_url,
            'resume_url': getattr(config, 'resume_url', ''),
            'calendar_url': f"https://cal.com/{config.cal_com_username}" if getattr(config, 'cal_com_username', None) else '',
            'profile_image': config.profile_image.url if config.profile_image else None,
            'hero_video': None,
            'meta_description': config.meta_description,
            'meta_keywords': config.meta_keywords,
        }
        
        return Response(data)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def site_stats(request):
    """Get site statistics"""
    try:
        total_projects = Project.objects.filter(is_published=True).count()
        total_technologies = Technology.objects.count()
        blog_posts = BlogPost.objects.filter(is_published=True).count()
        total_views = BlogPost.objects.filter(is_published=True).aggregate(
            total=Sum('views')
        )['total'] or 0
        
        data = {
            'years_experience': 2,
            'projects_completed': max(total_projects, 5),
            'technologies_mastered': max(total_technologies, 20),
            'blog_posts_written': blog_posts,
            'total_blog_views': total_views,
            'coffee_consumed': 1500,
        }
        
        return Response(data)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def contact_submit(request):
    """Handle contact form submissions using core model"""
    try:
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()
        
        # Validation
        if not all([name, email, subject, message]):
            return Response({'error': 'All fields are required'}, status=400)
        
        if '@' not in email:
            return Response({'error': 'Invalid email address'}, status=400)
        
        # Save to database using core model
        contact = ContactSubmission.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message,
            company=request.data.get('company', '')  # Optional field
        )
        
        # Send email notification
        try:
            html_content = f"""
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> {name} ({email})</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong></p>
            <p>{message.replace('\n', '<br>')}</p>
            <hr>
            <p>Submitted at: {contact.created_at}</p>
            """
            
            params = {
                "from": "onboarding@resend.dev",
                "to": ["nikhildodda@example.com"],
                "subject": f"Portfolio Contact: {subject}",
                "html": html_content,
            }
            
            resend.emails.send(params)
            
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
        
        return Response({
            'message': 'Thank you for your message! I\'ll get back to you within 24 hours.',
            'success': True
        })
        
    except Exception as e:
        print(f"Contact form error: {e}")
        return Response({'error': 'Something went wrong. Please try again.'}, status=500)

# Legacy function names for compatibility
def technologies_list(request):
    return tech_stack(request)

def send_contact_email(request):
    return contact_submit(request)