# Builder.io React App

This project integrates React with Builder.io to deliver visually editable content. It's built with Vite for fast development and hot module replacement.

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- A Builder.io account with content

### Configuration

1. **API Key Setup**
   - Log in to your Builder.io account
   - Go to Account Settings → API Keys
   - Copy your public API key
   - Open `src/App.jsx` and replace `YOUR_BUILDER_PUBLIC_API_KEY` with your actual public API key

2. **Content Integration**
   - The app is already configured to load a specific Builder.io content item (ID: 3b6402e8ab2f43ba9815a1790da0c8d5)
   - If you want to use different content, update the ID in the `fetchContent` function in `src/App.jsx`

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## How It Works

This app uses the Builder.io React SDK to fetch and render your visually created content:

1. The app initializes with your Builder.io public API key
2. It fetches content using the specific content ID
3. The `<BuilderComponent>` renders your Builder.io content
4. If no Builder.io content is found, a fallback UI is displayed

## Additional Resources

- [Builder.io Documentation](https://www.builder.io/c/docs/intro)
- [React Integration Guide](https://www.builder.io/c/docs/getting-started-with-react)
- [Content API Reference](https://www.builder.io/c/docs/content-api-reference)
