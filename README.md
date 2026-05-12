# AI Prompt Service

A simple Express service that forwards prompts to OpenAI's GPT-4.1 and returns the response.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Set your OpenAI API key:
   ```sh
   export OPENAI_API_KEY="your-api-key-here"
   ```

3. Start the server:
   ```sh
   node service.js
   ```

The server runs on port 3000.

## API

### POST /generate

Sends a prompt to GPT-4.1 and returns the response.

**Request**
```json
{
  "prompt": "Your prompt here"
}
```

**Response**
```json
{
  "response": "The model's response"
}
```

**Examples**

```sh
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is the capital of France?"}'
```

```sh
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a haiku about coding"}'
```

```sh
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain what a REST API is in one sentence"}'
```
