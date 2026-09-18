from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('CLIENT', 'Client'),
        ('POC', 'Department POC'),
        ('WORKER', 'Worker/Technician'),
    ]
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"

class Issue(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Floor(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('PENDING_ASSIGNMENT', 'Pending Technician Assignment'),
        ('PENDING_ASSESSMENT', 'Pending Technician Assessment'),
        ('PENDING_REVIEW', 'Pending POC Review'),
        ('CLOSED', 'Closed'),
    ]

    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_ASSIGNMENT')
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    issues = models.ManyToManyField(Issue)
    floors = models.ManyToManyField(Floor)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket {self.id} - {self.get_status_display()}"

class Activity(models.Model):
    TYPE_CHOICES = [
        ('EVENT', 'Event'),
        ('COMMENT', 'Comment'),
    ]
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    actor_name = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_type_display()} on Ticket {self.ticket_id}"
