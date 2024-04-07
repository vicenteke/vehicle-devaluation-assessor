from django.urls import path
from .views import (
    ConstantsVehicleTypesView,
    ConstantsBrandsView,
    ConstantsModelsView,
    ConstantsYearsView,
)

urlpatterns = [
    path('constants/<str:vehicleType>/<str:brandId>/<str:modelId>/years', ConstantsYearsView.as_view()),
    path('constants/<str:vehicleType>/<str:brandId>/models', ConstantsModelsView.as_view()),
    path('constants/<str:vehicleType>/brands', ConstantsBrandsView.as_view()),
    path('constants/vehicle_types', ConstantsVehicleTypesView.as_view()),
]
