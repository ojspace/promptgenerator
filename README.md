# SaasBoiled - AI Prompt Generator

A modern web application that generates powerful prompts for various AI tools using Google's Gemini AI.

## Features

- 🔐 Magic Link Authentication
- 🤖 AI-Powered Prompt Generation
- 🎨 Modern, Responsive UI
- 🚀 Fast and Reliable

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui Components

### Backend
- FastAPI
- Python 3.12+
- Google Gemini AI
- Resend for Email

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn
- Google Gemini API Key
- Resend API Key

### Environment Setup

1. Backend Setup:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the backend directory:
   ```
   GOOGLE_API_KEY=your_google_api_key
   JWT_SECRET_KEY=your_jwt_secret_key
   RESEND_API_KEY=your_resend_api_key
   FRONTEND_URL=http://localhost:3000
   ```

3. Frontend Setup:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Visit http://localhost:3000 in your browser

## Development

- Frontend runs on http://localhost:3000
- Backend API runs on http://localhost:8000
- API documentation available at http://localhost:8000/docs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
