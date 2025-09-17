from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import resend
import json
import os

# Set Resend API key
resend.api_key = "re_cLyUBKP3_BgQevi4fU8ZtLikDp8agzQN2"

@api_view(['POST'])
@csrf_exempt
def send_contact_email(request):
    try:
        if hasattr(request, 'data'):
            data = request.data
        else:
            data = json.loads(request.body)
            
        name = data.get('name')
        email = data.get('email') 
        subject = data.get('subject')
        message = data.get('message')
        
        if not all([name, email, subject, message]):
            return Response(
                {'error': 'All fields are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Send email using Resend
        params = {
            "from": "Portfolio Contact <onboarding@resend.dev>",
            "to": ["doddanikhil@gmail.com"],
            "subject": f"Portfolio Contact: {subject}",
            "html": f"""
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                {message}
            </div>
            """,
            "reply_to": [email]
        }
        
        email_response = resend.Emails.send(params)
        print(f"Email sent: {email_response}")
        
        return Response({'success': True, 'message': 'Email sent successfully'})
        
    except Exception as e:
        print(f"Email error: {e}")
        return Response(
            {'error': f'Failed to send email: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
