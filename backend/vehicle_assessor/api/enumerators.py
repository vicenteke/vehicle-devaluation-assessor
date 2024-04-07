from enum import Enum


class VehicleType(Enum):
    """
    Possible vehicle types, following the specs on
    https://deividfortuna.github.io/fipe/v2/
    """
    CAR = 'cars'
    MOTORCYCLE = 'motorcycles'
    TRUCK = 'trucks'
