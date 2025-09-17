# backend/projects/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project, Technology, TechCategory  # REMOVED CareerHighlight
import resend

# Set Resend API key
resend.api_key = "re_cLyUBKP3_BgQevi4fU8ZtLikDp8agzQN2"

@api_view(['GET'])
def api_test(request):
    return Response({
        'message': 'Portfolio API is working!',
        'version': '1.0',
        'endpoints': [
            '/api/v1/test/',
            '/api/v1/projects/',
            '/api/v1/projects/<slug>/',
            '/api/v1/technologies/',
            '/api/v1/contact/',
        ]
    })

@api_view(['GET'])
def projects_list(request):
    projects = Project.objects.filter(is_published=True)
    data = []
    for project in projects:
        technologies = []
        for tech in project.technologies.all():
            technologies.append({
                'name': tech.name,
                'category': tech.category.name
            })
        
        data.append({
            'title': project.title,
            'slug': project.slug,
            'tagline': project.tagline,
            'thumbnail': project.thumbnail.url if project.thumbnail else None,
            'is_featured': project.is_featured,
            'github_url': project.github_url,
            'live_demo_url': project.live_demo_url,
            'technologies': technologies,
            'created_at': project.created_at.isoformat(),
        })
    return Response(data)

@api_view(['GET'])
def project_detail(request, slug):
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
                'description': tech.description
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
            }
        
        data = {
            'title': project.title,
            'slug': project.slug,
            'tagline': project.tagline,
            'thumbnail': project.thumbnail.url if project.thumbnail else None,
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
def technologies_list(request):
    categories = TechCategory.objects.all()
    data = []
    
    for category in categories:
        technologies = []
        for tech in category.technology_set.all():
            technologies.append({
                'name': tech.name,
                'proficiency': tech.proficiency,
                'description': tech.description,
                'icon_url': tech.icon_url
            })
        
        if technologies:
            data.append({
                'category': category.name,
                'order': category.order,
                'technologies': technologies
            })
    
    return Response(data)

@api_view(['POST'])
def send_contact_email(request):
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        if not all([name, email, subject, message]):
            return Response({'error': 'All fields are required'}, status=400)
        
        # Send email using Resend
        params = {
            "from": "Portfolio <hello@your-domain.com>",
            "to": ["your-email@example.com"],
            "subject": f"Portfolio Contact: {subject}",
            "html": f"""
            <h3>New contact form submission</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong></p>
            <p>{message}</p>
            """,
        }
        
        email_response = resend.Emails.send(params)
        
        return Response({'message': 'Email sent successfully!'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)