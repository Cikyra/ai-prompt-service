# AI Prompt Service

An Express service that automatically classifies your prompt as text or image, then routes it to the appropriate OpenAI model and returns the result.

- **Text** → GPT-4.1 (5s timeout)
- **Image** → gpt-image-1.5 (35s timeout)

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

The service classifies the prompt automatically — no need to specify text or image.

**Request**
```json
{
  "prompt": "Your prompt here"
}
```

**Text response**
```json
{
  "response": "The model's text response"
}
```

**Image response**
```json
{
  "response": "<base64-encoded PNG string>"
}
```

**Error response**
```json
{
  "error": "Image generation failed: ..."
}
```

---

## Examples

### Text

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

### Image

```sh
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A sunset over the ocean"}'
```

```sh
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A cartoon dog wearing a space suit"}'
```

### Rendering an image response

The image response is a base64-encoded PNG. To display it in a browser:

```html
<img src="data:image/png;base64,<response>" />
```

Or save it to a file from the terminal:

```sh
curl -s -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A sunset over the ocean"}' \
  | node -e "const d=require('fs');process.stdin.resume();let b='';process.stdin.on('data',c=>b+=c);process.stdin.on('end',()=>d.writeFileSync('image.png',Buffer.from(JSON.parse(b).response,'base64')))"
```

This saves the result as `image.png` in the current directory.
