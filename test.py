import os
from google import genai

client = genai.Client(
    api_key='AQ.Ab8RN6J80Nm8XH4fH9Mm4P-CHjvd0BRl79rJkuJvrQFAXZVXCA'
)


response = client.models.generate_content(
    model="models/gemini-3.6-flash",
    contents="hey, how are you"
)

print(response.text)