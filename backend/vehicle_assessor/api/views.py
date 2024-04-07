import requests
import logging
from datetime import datetime

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

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
            },
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
            },
            ...
        ]
        """
        response = requests.get(
            f'https://fipe.parallelum.com.br/api/v2/'
            f'{kwargs.get("vehicleType")}/brands'
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
            },
            ...
        ]
        """
        response = requests.get(
            f'https://fipe.parallelum.com.br/api/v2/'
            f'{kwargs.get("vehicleType")}/brands/{kwargs.get("brandId")}'
            '/models'
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
            },
            ...
        ]
        """
        response = requests.get(
            f'https://fipe.parallelum.com.br/api/v2/'
            f'{kwargs.get("vehicleType")}/brands/{kwargs.get("brandId")}'
            f'/models/{kwargs.get("modelId")}/years'
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
    def get(self, request, format=None, **kwargs):
        """
        Return vehicle assesment

        Response:
        {
            "current_price": float,             # current vehicle price in BRL
            "original_price": float | null,     # original vehicle price in BRL
            "variation": float,                 # vehicle price variation
            "inflation": float                  # inflation on time interval
        }
        """
        now = datetime.now()
        vehicle_type = kwargs.get('vehicleType')
        brand_id = kwargs.get('brandId')
        model_id = kwargs.get('modelId')
        year_id = kwargs.get('yearId')
        acquisition_price = kwargs.get('acquisitionPrice')
        acquisition_year = kwargs.get('acquisitionYear')
        if acquisition_year > now.year or acquisition_year < 1920:
            return Response(
                'Acquisition year must be a number',
                status.HTTP_400_BAD_REQUEST
            )

        # get current price
        response = requests.get(
            f'https://fipe.parallelum.com.br/api/v2/{vehicle_type}'
            f'/brands/{brand_id}/models/{model_id}/years/{year_id}'
        )
        if response.status_code != 200:
            return Response(response.reason, response.status_code)

        response_price = response.json()['price']
        current_price = float(response_price.replace('.', '')[3:-3])
        variation = (current_price / acquisition_price) - 1

        # get original price for acquisition date
        original_price = None
        reference_id = None
        references = requests.get(
            'https://fipe.parallelum.com.br/api/v2/references'
        )
        if references.status_code != 200:
            logger.warning('Unable to get reference month for original price')
            return Response(references.reason, references.status_code)
        else:
            references = references.json()
            reference_id = None
            for reference in references:
                if str(acquisition_year) in reference['month']:
                    reference_id = reference['code']
                    break

            if reference_id:
                response = requests.get(
                    f'https://fipe.parallelum.com.br/api/v2/{vehicle_type}'
                    f'/brands/{brand_id}/models/{model_id}/years/{year_id}'
                    f'?reference={reference_id}'
                )
                if response.status_code != 200:
                    logger.warning('Unable to get vehicle original price')
                else:
                    response_price = response.json()['price']
                    original_price = float(response_price.replace('.', '')[3:-3])

        # get inflation
        inflation = None
        current_year = now.year
        last_inflation_month = now.month - 2
        if last_inflation_month < 1:
            last_inflation_month = 12 + last_inflation_month - 1
            current_year -= 1
            acquisition_year -= 1

        start_month_code = str(acquisition_year) +\
            "{:02d}".format(last_inflation_month)
        current_month_code = str(current_year) +\
            "{:02d}".format(last_inflation_month)

        response = requests.get(
            f'https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/'
            f'{start_month_code}%7C{current_month_code}/variaveis/'
            f'2266?localidades=N1[all]'
        )
        if response.status_code != 200:
            logger.warning('Unable to get inflation')
        else:
            data = response.json()[0]['resultados'][0]['series'][0]['serie']
            start_rate = float(data[start_month_code])
            current_rate = float(data[current_month_code])
            inflation = current_rate / start_rate

        return Response({
            'current_price': current_price,
            'original_price': original_price,
            'variation': variation,
            'inflation': inflation
        })
