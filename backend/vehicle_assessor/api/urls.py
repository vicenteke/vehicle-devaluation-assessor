from django.urls import path
from .views import (
    ConstantsVehicleTypesView,
    ConstantsBrandsView,
    ConstantsModelsView,
    ConstantsYearsView,
    VehicleAssessorView,
)

urlpatterns = [
    path(
        'constants/<str:vehicleType>/<str:brandId>/<str:modelId>/years',
        ConstantsYearsView.as_view()
    ),
    path(
        'constants/<str:vehicleType>/<str:brandId>/models',
        ConstantsModelsView.as_view()
    ),
    path('constants/<str:vehicleType>/brands', ConstantsBrandsView.as_view()),
    path('constants/vehicle_types', ConstantsVehicleTypesView.as_view()),
    path(
        '<str:vehicleType>/<str:brandId>/<str:modelId>/<str:yearId>'
        '/<int:acquisitionPrice>/<int:acquisitionYear>',
        VehicleAssessorView.as_view()
    ),
]
