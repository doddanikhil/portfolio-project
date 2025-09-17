# portfolio_backend/projects/serializers.py
from rest_framework import serializers
from .models import Project, ProjectDetail, Technology, TechCategory, CareerHighlight

class TechnologySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Technology
        fields = ['name', 'category_name', 'proficiency', 'icon_url', 'description']

class ProjectListSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'title', 'slug', 'tagline', 'thumbnail', 'technologies',
            'github_url', 'live_demo_url', 'is_featured', 'created_at'
        ]

class ProjectDetailSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    details = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'title', 'slug', 'tagline', 'thumbnail', 'technologies',
            'github_url', 'live_demo_url', 'created_at', 'details'
        ]
    
    def get_details(self, obj):
        try:
            detail = obj.details
            return {
                'problem_statement': detail.problem_statement,
                'solution_approach': detail.solution_approach,
                'technology_justification': detail.technology_justification,
                'technical_architecture': detail.technical_architecture.url if detail.technical_architecture else None,
                'key_features': detail.key_features,
                'performance_metrics': detail.performance_metrics,
                'challenges_solved': detail.challenges_solved,
                'demo_video_url': detail.demo_video_url,
                'lessons_learned': detail.lessons_learned,
            }
        except ProjectDetail.DoesNotExist:
            return None
