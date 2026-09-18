from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, IssueViewSet, FloorViewSet, TicketViewSet, ActivityViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'floors', FloorViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'activities', ActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
