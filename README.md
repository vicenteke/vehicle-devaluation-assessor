# Vehicle Devaluation Assessor
Allows you to evaluate how much has your vehicle devaluated. Applies only to Brazil.

## Front-End
Implemented using **Next.js** and **Chakra UI**. To run it, go to the `frontend/` folder and run `npm run dev`.

There will be images soon.

## Back-End
Implemented using the **Django REST Framework (DRF)**. To run it, go to the `backend/world-housing-api/` folder and run `python manage.py runserver`. You might wnat to create a virtual environment (`venv`), so make sure are running the commands from there.

### Assess a vehicle devaluation

```
GET /<str:vehicleType>/<str:brandId>/<str:modelId>/<str:yearId>/<int:acquisitionPrice>/<int:acquisitionYear>
```

**Response**
```
{
    "current_price": float,             # current vehicle price in BRL
    "original_price": float | null,     # original vehicle price in BRL
    "variation": float,                 # vehicle price variation
    "inflation": float                  # inflation on time interval
}
```

E.g. `/cars/21/555/2004-1/10000/2003`.

### Get vehicle types
```
GET /constants/vehicle_types
```

**Response**
```
[
    {
        "label": string,
        "value": string
    },
    ...
]
```

NOTE: you will always use the `value` field on subsequent endpoints, as the `label` is simply a human-friendly description.

### Get brands for vehicle type
```
GET /constants/<str:vehicleType>/brands
```

**Response**
```
[
    {
        "label": string,
        "value": string
    },
    ...
]
```

### Get models for brand
```
GET /constants/<str:vehicleType>/<str:brandId>/models
```

**Response**
```
[
    {
        "label": string,
        "value": string
    },
    ...
]
```

### Get years for model
```
GET /constants/<str:vehicleType>/<str:brandId>/<str:modelId>/years
```

**Response**
```
[
    {
        "label": string,
        "value": string
    },
    ...
]
```
