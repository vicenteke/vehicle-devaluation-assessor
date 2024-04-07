from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class InflationRate(models.Model):
    """Inflation Rate in absolute index"""
    month = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    year = models.SmallIntegerField(validators=[MinValueValidator(1979), MaxValueValidator(2200)])
    rate = models.DecimalField(max_digits=20, decimal_places=5)

    def __str__(self):
        return f'{"{:02d}".format(self.month)}/{self.year} {self.rate}'
    
    class Meta:
        ordering = ['-year', '-month']
        constraints = [
            models.UniqueConstraint(
                'year', 'month',
                name="un_year_month_apiinflationrates"
            ),
        ]
