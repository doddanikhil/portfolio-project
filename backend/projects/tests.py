from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json


class APITestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_api_test_endpoint(self):
        """Test the API test endpoint returns expected data"""
        url = reverse('api_test')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        self.assertIn('message', data)
        self.assertIn('version', data)
        self.assertIn('status', data)
        self.assertIn('endpoints', data)
        self.assertEqual(data['status'], 'healthy')

    def test_projects_list_endpoint(self):
        """Test the projects list endpoint"""
        url = reverse('projects_list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_featured_projects_endpoint(self):
        """Test the featured projects endpoint"""
        url = reverse('featured_projects')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_tech_stack_endpoint(self):
        """Test the tech stack endpoint"""
        url = reverse('tech_stack')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_career_highlights_endpoint(self):
        """Test the career highlights endpoint"""
        url = reverse('career_highlights')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_site_metadata_endpoint(self):
        """Test the site metadata endpoint"""
        url = reverse('site_metadata')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        # Check required fields
        required_fields = ['name', 'tagline', 'bio', 'email']
        for field in required_fields:
            self.assertIn(field, data)

    def test_contact_submit_endpoint_invalid_data(self):
        """Test contact form submission with invalid data"""
        url = reverse('contact_submit')
        
        # Test with empty data
        response = self.client.post(url, {}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with missing fields
        incomplete_data = {
            'name': 'Test User',
            'email': 'test@example.com'
            # Missing subject and message
        }
        response = self.client.post(
            url, 
            json.dumps(incomplete_data), 
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_contact_submit_endpoint_valid_data(self):
        """Test contact form submission with valid data"""
        url = reverse('contact_submit')
        
        valid_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'subject': 'Test Subject',
            'message': 'This is a test message'
        }
        
        response = self.client.post(
            url,
            json.dumps(valid_data),
            content_type='application/json'
        )
        
        # Should succeed or handle gracefully
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])


class BlogAPITestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_blog_posts_list_endpoint(self):
        """Test the blog posts list endpoint"""
        response = self.client.get('/api/v1/blog/posts/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_recent_blog_posts_endpoint(self):
        """Test the recent blog posts endpoint"""
        response = self.client.get('/api/v1/blog/recent/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)


class CoreAPITestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_site_config_endpoint(self):
        """Test the core site config endpoint"""
        response = self.client.get('/api/v1/core/config/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        # Check required fields
        required_fields = ['site_name', 'tagline', 'bio', 'email']
        for field in required_fields:
            self.assertIn(field, data)
