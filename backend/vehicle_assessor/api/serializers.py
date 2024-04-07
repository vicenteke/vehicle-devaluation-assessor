from rest_framework.serializers import Serializer
from .models import (
    InflationRate
)


# class ConstantsSerializer(Serializer):
#     def to_representation(self, obj):
#         brand_vehicles = obj.get('brand_vehicles') 
#         brands = obj.get('brands')
#         res = {}
#         for entry in obj:
#             res[entry.state.abbreviation] = HousingDataValuesSerializer(entry).data
#         return res
