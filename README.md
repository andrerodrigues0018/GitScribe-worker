# GitScribe Worker

GitScribe Worker is a Cloudflare Worker service that automates Pull Request descriptions and titles using Google's Gemini AI. It analyzes your code changes and generates meaningful PR descriptions to improve development workflow and documentation.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **AI Integration**: Google Gemini AI
- **Development Tools**:
  - Wrangler CLI
  - Node.js
  - npm

## Key Features

- Automated PR description generation
- Intelligent title suggestions
- Code change analysis
- Integration with GitHub webhooks
- Real-time processing

## Installation

To install the dependencies, run the following command:

```sh
npm install
```

## Configuration

### Environment Variables

Create a `dev.vars` file in the root directory of your project and add your environment variables:

```sh
# dev.vars
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
```

### Wrangler Configuration

Create a `wrangler.toml.jsonc` file in the root directory of your project and configure it with your Cloudflare account details:

```jsonc
{
	"name": "gitscribe",
	"main": "src/index.ts",
	"compatibility_date": "2025-03-21",
}
```

## Running Locally

To run your Cloudflare Worker locally, use the following command:

```sh
npm run dev
```

This will start a local server using `wrangler dev`.

## Deployment

To deploy your Cloudflare Worker to production, ensure you have logged in Cloudflare Account (tecnologia@escoladnc.com.br). Then, run the following command:

```sh
npm run deploy
```

This will deploy your worker to Cloudflare's edge network.

## API Documentation

The worker exposes the following endpoint:

- `POST /webhook`: Receives GitHub webhook events and processes PR-related actions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
