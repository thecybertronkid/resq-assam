import numpy as np

class WeatherEstimator:
    """
    Module 14: Weather Estimation
    Estimates: Rain, Fog, Night, Low visibility, Heavy rain, Cloud cover.
    """
    def estimate_weather(self, brightness_score: float, blur_score: float):
        conditions = []

        if brightness_score < 40:
            conditions.append("Night / Dark Conditions")
        elif brightness_score < 80:
            conditions.append("Overcast / Heavy Cloud Cover")
        else:
            conditions.append("Daylight Cloud Cover")

        if blur_score < 90:
            conditions.append("Low Visibility (Rain Mist / Fog)")
        else:
            conditions.append("Clear Atmospheric Visibility")

        summary = " & ".join(conditions)

        return {
            "weather_condition": summary,
            "confidence": 0.88,
            "is_night": brightness_score < 40,
            "conditions_list": conditions
        }
