from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Ticket, Issue, Floor, User

class TicketAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.issue = Issue.objects.create(name='AC not cooling')
        self.floor = Floor.objects.create(name='1F')
        self.user = User.objects.create(name='Test User', role='CLIENT')

    def test_create_ticket_without_issues_fails(self):
        response = self.client.post('/api/tickets/', {
            'floors': [self.floor.id],
            'description': 'Test ticket'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('issues', response.data)

    def test_create_ticket_without_floors_fails(self):
        response = self.client.post('/api/tickets/', {
            'issues': [self.issue.id],
            'description': 'Test ticket'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('floors', response.data)

    def test_create_ticket_success(self):
        response = self.client.post('/api/tickets/', {
            'issues': [self.issue.id],
            'floors': [self.floor.id],
            'description': 'Valid ticket'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ticket.objects.count(), 1)

    def test_pagination_and_tabs(self):
        # Create 15 tickets
        for i in range(15):
            t = Ticket.objects.create(status='PENDING_ASSIGNMENT')
            t.issues.add(self.issue)
            t.floors.add(self.floor)

        # Test pagination count
        response = self.client.get('/api/tickets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 15)
        self.assertEqual(len(response.data['results']), 10)

        # Test open vs closed
        t = Ticket.objects.first()
        t.status = 'CLOSED'
        t.save()

        # Fetch open tickets
        response = self.client.get('/api/tickets/?status=open')
        self.assertEqual(response.data['count'], 14)

        # Fetch closed tickets
        response = self.client.get('/api/tickets/?status=closed')
        self.assertEqual(response.data['count'], 1)
