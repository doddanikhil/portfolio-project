# backend/portfolio_backend/core/views.py (COMPLETE VERSION)
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import CareerHighlight, SiteConfiguration, ContactSubmission
import resend
import json
import os

# Set Resend API key
resend.api_key = "re_cLyUBKP3_BgQevi4fU8ZtLikDp8agzQN2"

@api_view(['GET'])
def career_highlights(request):
    """Get all career highlights"""
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
            'is_current': highlight.is_current,
            'order': highlight.order
        })
    return Response(data)

@api_view(['GET'])  
def site_config(request):
    """Get site configuration"""
    try:
        config = SiteConfiguration.objects.first()
        if not config:
            # Return default values if no config exists
            return Response({
                'site_name': 'Nikhil Dodda',
                'tagline': 'Applied AI Engineer',
                'bio': 'Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure.',
                'email': 'hello@nikhildodda.dev',
                'github_url': 'https://github.com/your-username',
                'bluesky_handle': '@devdn.bsky.social',
                'cal_com_username': 'dnpro',
                'linkedin_url': '',  # Empty since you don't want LinkedIn
                'twitter_url': '',   # Empty since you prefer Bluesky
                'profile_image': None,
                'resume_file': None,
                'meta_description': 'Applied AI Engineer specializing in production LLM systems, RAG architectures, and scalable ML infrastructure.',
                'meta_keywords': 'AI Engineer, Machine Learning, LLM, RAG Systems, Python, AWS, MLOps'
            })
        
        data = {
            'site_name': config.site_name,
            'tagline': config.tagline,
            'bio': config.bio,
            'email': config.email,
            'github_url': config.github_url,
            'bluesky_handle': getattr(config, 'bluesky_handle', '@devdn.bsky.social'),
            'cal_com_username': config.cal_com_username,
            'linkedin_url': config.linkedin_url if hasattr(config, 'linkedin_url') else '',
            'twitter_url': config.twitter_url if hasattr(config, 'twitter_url') else '',
            'profile_image': config.profile_image.url if config.profile_image else None,
            'resume_file': config.resume_file.url if config.resume_file and config.resume_file else None,
            'meta_description': config.meta_description,
            'meta_keywords': config.meta_keywords,
        }
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def portfolio_stats(request):
    """Get portfolio statistics for dashboard"""
    from projects.models import Project, Technology
    
    total_projects = Project.objects.filter(is_published=True).count()
    featured_projects = Project.objects.filter(is_published=True, is_featured=True).count()
    technologies_count = Technology.objects.count()
    
    # Your reported metrics from VS SOFT
    stats = {
        'total_projects': total_projects,
        'featured_projects': featured_projects,
        'technologies_mastered': technologies_count,
        'years_experience': 2,  # Adjust based on your timeline
        'uptime_percentage': '99.9',  # Your reported uptime
        'performance_improvement': '40'  # Your latency improvement
    }
    
    return Response(stats)

@api_view(['POST'])
@csrf_exempt
def send_contact_email(request):
    """Handle contact form submissions and send emails"""
    try:
        if hasattr(request, 'data'):
            data = request.data
        else:
            data = json.loads(request.body)
            
        name = data.get('name')
        email = data.get('email') 
        company = data.get('company', '')  # Optional field
        subject = data.get('subject')
        message = data.get('message')
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return Response(
                {'error': 'Name, email, subject, and message are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save to database
        contact_submission = ContactSubmission.objects.create(
            name=name,
            email=email,
            company=company,
            subject=subject,
            message=message
        )
        
        # Send email using Resend
        params = {
            "from": "Portfolio Contact <onboarding@resend.dev>",
            "to": ["doddanikhil@gmail.com"],
            "subject": f"Portfolio Contact: {subject}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    New Portfolio Contact Form Submission
                </h2>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 10px 0;"><strong>Name:</strong> {name}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> {email}</p>
                    {f'<p style="margin: 10px 0;"><strong>Company:</strong> {company}</p>' if company else ''}
                    <p style="margin: 10px 0;"><strong>Subject:</strong> {subject}</p>
                </div>
                
                <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #374151; margin-top: 0;">Message:</h3>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; line-height: 1.6;">
                        {message.replace(chr(10), '<br>')}
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                    <p>Sent from your portfolio contact form at nikhildodda.dev</p>
                    <p>Time: {contact_submission.created_at.strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                </div>
            </div>
            """,
            "reply_to": [email]
        }
        
        try:
            email_response = resend.Emails.send(params)
            print(f"Email sent successfully: {email_response}")
            
            return Response({
                'success': True, 
                'message': 'Thank you for your message! I\'ll get back to you soon.',
                'id': contact_submission.id
            })
            
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
            # Still return success since we saved to database
            return Response({
                'success': True,
                'message': 'Your message has been received. I\'ll get back to you soon!',
                'id': contact_submission.id,
                'note': 'Email delivery pending'
            })
        
    except Exception as e:
        print(f"Contact form error: {e}")
        return Response(
            {'error': f'Failed to process contact form: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )