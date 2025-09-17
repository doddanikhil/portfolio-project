from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Project, Technology, TechCategory, CareerHighlight, SiteConfiguration
from portfolio_backend.blog.models import BlogPost, ContactSubmission
import resend
import os

# Set Resend API key
resend.api_key = os.getenv("RESEND_API_KEY", "re_cLyUBKP3_BgQevi4fU8ZtLikDp8agzQN2")

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
                'color': tech.color
            })
        
        data.append({
            'title': project.title,
            'slug': project.slug,
            'tagline': project.tagline,
            'thumbnail': project.thumbnail.url if project.thumbnail else None,
            'hero_image': project.hero_image.url if project.hero_image else None,
            'is_featured': project.is_featured,
            'github_url': project.github_url,
            'live_demo_url': project.live_demo_url,
            'technologies': technologies,
            'created_at': project.created_at.isoformat(),
            'priority': project.priority
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
                'color': tech.color
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
        
        # Get technologies with full details
        technologies = []
        for tech in project.technologies.all():
            technologies.append({
                'name': tech.name,
                'category': tech.category.name,
                'proficiency': tech.proficiency,
                'icon_url': tech.icon_url,
                'description': tech.description,
                'color': tech.color
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
                'lessons_learned': project.details.lessons_learned,
                'code_snippets': project.details.code_snippets,
            }
        
        data = {
            'title': project.title,
            'slug': project.slug,
            'tagline': project.tagline,
            'thumbnail': project.thumbnail.url if project.thumbnail else None,
            'hero_image': project.hero_image.url if project.hero_image else None,
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
                'color': tech.color
            })
        
        if technologies:
            data.append({
                'category': category.name,
                'order': category.order,
                'technologies': technologies
            })
    
    return Response(data)

@api_view(['GET'])
def career_highlights(request):
    """Get career highlights"""
    highlights = CareerHighlight.objects.all()
    data = []
    
    for highlight in highlights:
        technologies = []
        for tech in highlight.technologies.all():
            technologies.append({
                'name': tech.name,
                'category': tech.category.name,
                'color': tech.color
            })
        
        data.append({
            'title': highlight.title,
            'organization': highlight.organization,
            'date_range': highlight.date_range,
            'description': highlight.description,
            'metrics': highlight.metrics,
            'technologies': technologies,
            'order': highlight.order
        })
    
    return Response(data)

@api_view(['GET'])
def site_metadata(request):
    """Get site configuration and metadata"""
    try:
        config = SiteConfiguration.objects.first()
        if not config:
            # Create default config if none exists
            config = SiteConfiguration.objects.create()
        
        data = {
            'name': config.name,
            'tagline': config.tagline,
            'bio': config.bio,
            'location': config.location,
            'email': config.email,
            'linkedin_url': config.linkedin_url,
            'github_url': config.github_url,
            'resume_url': config.resume_url,
            'calendar_url': config.calendar_url,
            'profile_image': config.profile_image.url if config.profile_image else None,
            'hero_video': config.hero_video.url if config.hero_video else None,
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
        config = SiteConfiguration.objects.first()
        if not config:
            config = SiteConfiguration.objects.create()
        
        # Calculate dynamic stats
        total_projects = Project.objects.filter(is_published=True).count()
        total_technologies = Technology.objects.count()
        blog_posts = BlogPost.objects.filter(is_published=True).count()
        total_views = BlogPost.objects.filter(is_published=True).aggregate(
            total=models.Sum('views')
        )['total'] or 0
        
        data = {
            'years_experience': config.years_experience,
            'projects_completed': max(total_projects, config.projects_completed),
            'technologies_mastered': max(total_technologies, config.technologies_mastered),
            'blog_posts_written': blog_posts,
            'total_blog_views': total_views,
            'coffee_consumed': config.coffee_consumed,
        }
        
        return Response(data)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def contact_submit(request):
    """Handle contact form submissions"""
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
        
        # Save to database
        contact = ContactSubmission.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
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
            <p>Submitted at: {contact.submitted_at}</p>
            """
            
            params = {
                "from": "onboarding@resend.dev",
                "to": ["nikhildodda@example.com"],  # Replace with your email
                "subject": f"Portfolio Contact: {subject}",
                "html": html_content,
            }
            
            resend.emails.send(params)
            
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
            # Don't fail the request if email fails
        
        return Response({
            'message': 'Thank you for your message! I\'ll get back to you within 24 hours.',
            'success': True
        })
        
    except Exception as e:
        print(f"Contact form error: {e}")
        return Response({'error': 'Something went wrong. Please try again.'}, status=500)
