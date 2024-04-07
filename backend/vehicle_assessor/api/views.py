from rest_framework.views import APIView
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class ConstantsView(APIView):
    def get(self, request, format=None):
        """
        List brands and models
        
        """
        # https://fipe.parallelum.com.br/api/v2/{vehicleType}/brands
        # https://fipe.parallelum.com.br/api/v2/{vehicleType}/brands/{brandId}/models for each brand
        # https://fipe.parallelum.com.br/api/v2/{vehicleType}/brands/{brandId}/models/{modelId}/years for each model
        res = {}
        return Response(res)


class VehicleAssessorView(APIView):
    """Return assessment for vehicle"""
