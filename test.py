from openai import OpenAI

client = OpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1",
)

response = client.chat.completions.create(
    model="openrouter/free",
    messages=[
        {"role": "user", "content": "Hello"}
    ],
)

print("Model used:", response.model)
print(response.choices[0].message.content)