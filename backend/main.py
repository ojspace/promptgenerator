from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv
import os
import jwt
from datetime import datetime, timedelta
import resend

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Generation config for the model
GENERATION_CONFIG = {
    "temperature": 0.4,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

# System instructions for different project types
SYSTEM_INSTRUCTIONS = {
    "web": """You are an expert web development prompt engineer. Your task is to generate detailed, specific prompts for web development projects.
    Focus on: modern frameworks, responsive design, user experience, accessibility, SEO, and performance.
    Format your responses with clear sections for: architecture, UI/UX, technical requirements, and potential challenges.""",
    
    "mobile": """You are an expert mobile development prompt engineer. Your task is to generate detailed, specific prompts for mobile app projects.
    Focus on: native features, cross-platform compatibility, mobile UI patterns, performance, and user engagement.
    Format your responses with clear sections for: app architecture, UI/UX flows, technical specifications, and platform-specific considerations.""",
    
    "ai": """You are an expert AI/ML prompt engineer. Your task is to generate detailed, specific prompts for AI/ML projects.
    Focus on: model architecture, data requirements, training approach, evaluation metrics, and deployment strategies.
    Format your responses with clear sections for: data preparation, model design, training process, and production considerations.""",
    
    "desktop": """You are an expert desktop application prompt engineer. Your task is to generate detailed, specific prompts for desktop software projects.
    Focus on: native performance, system integration, cross-platform compatibility, and desktop-specific UI patterns.
    Format your responses with clear sections for: application architecture, UI/UX design, system requirements, and distribution strategy."""
}

class ProjectType(str, Enum):
    WEB = "web"
    MOBILE = "mobile"
    AI = "ai"
    DESKTOP = "desktop"

class EmailRequest(BaseModel):
    email: EmailStr

class TokenRequest(BaseModel):
    token: str

class PromptRequest(BaseModel):
    prompt: str
    project_type: ProjectType
    image_data: Optional[str] = None

class PromptResponse(BaseModel):
    response: str

def create_magic_link(email: str) -> str:
    expiration = datetime.utcnow() + timedelta(minutes=5)
    token = jwt.encode(
        {"email": email, "exp": expiration},
        os.getenv("JWT_SECRET_KEY", "your-secret-key"),
        algorithm="HS256"
    )
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    return f"{frontend_url}/verify?token={token}"

@app.post("/auth/login")
async def login(request: EmailRequest):
    try:
        magic_link = create_magic_link(request.email)
        params = {
            "from": "onboarding@resend.dev",
            "to": request.email,
            "subject": "Your Magic Link",
            "html": f"""
                <h1>Welcome to Prompt Generator!</h1>
                <p>Click the link below to log in:</p>
                <a href="{magic_link}">Log In</a>
                <p>This link will expire in 5 minutes.</p>
            """
        }
        
        resend.api_key = os.getenv("RESEND_API_KEY")
        resend.Emails.send(params)
        print(f"Magic Link: {magic_link}")
        return {"message": "Magic link sent successfully"}
        
    except Exception as e:
        print(f"Error sending magic link: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send magic link")

@app.post("/auth/verify")
async def verify_token(request: TokenRequest):
    try:
        payload = jwt.decode(request.token, os.getenv("JWT_SECRET_KEY", "your-secret-key"), algorithms=["HS256"])
        email = payload.get("email")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Error verifying token: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to verify token")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/generate")
async def generate_response(request: PromptRequest):
    try:
        # Initialize the model with custom configuration
        model = genai.GenerativeModel(
            model_name="gemini-pro-vision" if request.image_data else "gemini-pro",
            generation_config=GENERATION_CONFIG
        )
        
        # Start a chat session with system instruction
        chat = model.start_chat(history=[
            {"role": "user", "parts": [SYSTEM_INSTRUCTIONS[request.project_type]]},
            {"role": "model", "parts": ["I understand and will act as a specialized prompt engineer for this project type."]}
        ])
        
        # Prepare the content
        content = []
        content.append(request.prompt)
        
        # Add image if provided
        if request.image_data and "base64" in request.image_data:
            try:
                image_data = request.image_data.split(',')[1] if ',' in request.image_data else request.image_data
                content.append({
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": image_data
                    }
                })
            except Exception as e:
                print(f"Error processing image: {str(e)}")
        
        # Generate response
        response = chat.send_message(content)
        
        return {"response": response.text}
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
