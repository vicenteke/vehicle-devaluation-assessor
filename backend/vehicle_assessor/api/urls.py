from django.urls import path
from .views import (
    VehicleAssessorView,
    ConstantsView
)

urlpatterns = [
    path('constants/', ConstantsView.as_view()),
    path('', VehicleAssessorView.as_view()),
]
