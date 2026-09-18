from django.contrib import admin
from .models import User, Issue, Floor, Ticket, Activity

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'role')
    list_filter = ('role',)
    search_fields = ('name',)

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_issues', 'status', 'assignee', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('description', 'issues__name')
    
    def get_issues(self, obj):
        return ", ".join([issue.name for issue in obj.issues.all()])
    get_issues.short_description = 'Issues'

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'type', 'actor_name', 'created_at')
    list_filter = ('type', 'created_at')
    search_fields = ('actor_name', 'text')
