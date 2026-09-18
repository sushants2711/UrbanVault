from rest_framework import viewsets, status, pagination
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Issue, Floor, Ticket, Activity
from .serializers import UserSerializer, IssueSerializer, FloorSerializer, TicketSerializer, ActivitySerializer, TicketActionSerializer

class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class IssueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class FloorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            if status_filter == 'open':
                queryset = queryset.exclude(status='CLOSED')
            elif status_filter == 'closed':
                queryset = queryset.filter(status='CLOSED')
            else:
                queryset = queryset.filter(status=status_filter)
        
        search_query = self.request.query_params.get('search', None)
        if search_query:
            from django.db.models import Q
            # Search by description, issue name, or ticket ID
            queryset = queryset.filter(
                Q(description__icontains=search_query) |
                Q(issues__name__icontains=search_query) |
                Q(id__icontains=search_query)
            ).distinct()

        floor_filter = self.request.query_params.get('floor', None)
        if floor_filter and floor_filter != 'all':
            queryset = queryset.filter(floors__name=floor_filter)

        sort_by = self.request.query_params.get('sort_by', None)
        if sort_by == 'oldest':
            queryset = queryset.order_by('created_at')
        else:
            queryset = queryset.order_by('-created_at')
            
        return queryset
        
    def perform_create(self, serializer):
        ticket = serializer.save()
        Activity.objects.create(
            ticket=ticket,
            type='EVENT',
            actor_name='Client',
            text='created the ticket.'
        )

    @action(detail=True, methods=['post'])
    def perform_action(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketActionSerializer(data=request.data)
        if serializer.is_valid():
            action_type = serializer.validated_data['action']
            actor = request.data.get('actor_name', 'User')
            
            if action_type == 'ASSIGN_WORKER':
                assignee_id = serializer.validated_data.get('assignee_id')
                if not assignee_id:
                    return Response({"error": "assignee_id is required"}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    user = User.objects.get(id=assignee_id)
                    ticket.assignee = user
                    ticket.status = 'PENDING_ASSESSMENT'
                    ticket.save()
                    Activity.objects.create(ticket=ticket, type='EVENT', actor_name=actor, text=f'assigned technician {user.name}.')
                except User.DoesNotExist:
                    return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
                    
            elif action_type == 'SUBMIT_ASSESSMENT':
                ticket.status = 'PENDING_REVIEW'
                ticket.save()
                Activity.objects.create(ticket=ticket, type='EVENT', actor_name=actor, text='submitted the assessment.')
                
            elif action_type == 'MARK_RESOLVED':
                ticket.status = 'CLOSED'
                ticket.save()
                Activity.objects.create(ticket=ticket, type='EVENT', actor_name=actor, text='marked the ticket as resolved/closed.')

            comment = serializer.validated_data.get('comment')
            if comment:
                Activity.objects.create(ticket=ticket, type='COMMENT', actor_name=actor, text=comment)
                
            return Response(TicketSerializer(ticket).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
