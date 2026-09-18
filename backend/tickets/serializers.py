from rest_framework import serializers
from .models import User, Issue, Floor, Ticket, Activity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'

class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('created_at',)

class TicketSerializer(serializers.ModelSerializer):
    issues_detail = IssueSerializer(source='issues', many=True, read_only=True)
    floors_detail = FloorSerializer(source='floors', many=True, read_only=True)
    assignee_detail = UserSerializer(source='assignee', read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Ticket
        fields = '__all__'

class TicketActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['ASSIGN_WORKER', 'SUBMIT_ASSESSMENT', 'MARK_RESOLVED'])
    assignee_id = serializers.IntegerField(required=False)
    comment = serializers.CharField(required=False, allow_blank=True)
