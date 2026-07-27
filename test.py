import os
from google import genai

client = genai.Client(
    api_key='AQ.Ab8RN6LypBCjnQOAB-4sXRnMvcPm4A1QI6F7mA0Wj-x8Q9cq-w'
)


response = client.models.generate_content(
    model="models/gemini-3.6-flash",
    contents="hey, how are you"
)

print(response.text)