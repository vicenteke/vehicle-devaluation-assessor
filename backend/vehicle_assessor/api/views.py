import requests
import logging
from rest_framework.views import APIView
from rest_framework.response import Response

from .enumerators import VehicleType


logger = logging.getLogger()


class ConstantsVehicleTypesView(APIView):
    def get(self, request, format=None):
        """
        List vehicle types

        Response:
        [
            {
                "label": string,
                "value": string
            }
            ...
        ]
        """
        return Response([
            {
                'label': vehicle_type.name.capitalize(),
                'value': vehicle_type.value
            } for vehicle_type in VehicleType
        ])


class ConstantsBrandsView(APIView):
    def get(self, request, format=None, **kwargs):
        """
        List brands for vehicle type

        Response:
        [
            {
                "label": string,
                "value": string
            }
            ...
        ]
        """
        response = requests.get(
            f'https://fipe.parallelum.com.br/api/v2/{kwargs.get("vehicleType")}/brands'
        )
        if response.status_code != 200:
            return Response(response.reason, response.status_code)

        return Response([
            {
                'label': entry['name'],
                'value': entry['code'],
            } for entry in response.json()
        ])


class ConstantsModelsView(APIView):
    def get(self, request, format=None, **kwargs):
        """
        List models for brand ID

        Response:
        [
            {
                "label": string,
                "value": string
            }
            ...
        ]
        """
        response = requests.get(
            f'https://fipe.parallelum.com.br/api/v2/{kwargs.get("vehicleType")}/brands/{kwargs.get("brandId")}/models'
        )
        if response.status_code != 200:
            return Response(response.reason, response.status_code)

        return Response([
            {
                'label': entry['name'],
                'value': entry['code'],
            } for entry in response.json()
        ])


class ConstantsYearsView(APIView):
    def get(self, request, format=None, **kwargs):
        """
        List years for model ID

        Response:
        [
            {
                "label": string,
                "value": string
            }
            ...
        ]
        """
        response = requests.get(
            f'https://fipe.parallelum.com.br/api/v2/{kwargs.get("vehicleType")}/brands/{kwargs.get("brandId")}/models/{kwargs.get("modelId")}/years'
        )
        if response.status_code != 200:
            return Response(response.reason, response.status_code)

        return Response([
            {
                'label': entry['name'],
                'value': entry['code'],
            } for entry in response.json()
        ])


class VehicleAssessorView(APIView):
    """Return assessment for vehicle"""
