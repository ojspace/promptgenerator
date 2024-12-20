from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv
import os
import jwt
from datetime import datetime, timedelta
import resend
from pathlib import Path

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")  # Change in production
ALGORITHM = "HS256"

# Resend Configuration
resend.api_key = os.getenv("RESEND_API_KEY")

class EmailRequest(BaseModel):
    email: EmailStr

class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    response: str

class TokenRequest(BaseModel):
    token: str

def create_magic_link(email: str) -> str:
    expiration = datetime.utcnow() + timedelta(minutes=5)
    token = jwt.encode(
        {"email": email, "exp": expiration},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    return f"{frontend_url}/verify?token={token}"

def send_magic_link(email: str, magic_link: str):
    try:
        params = {
            "from": "SaasBoiled <onboarding@resend.dev>",
            "to": email,
            "subject": "Your Magic Link to Sign In",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to SaasBoiled!</h2>
                <p>Click the button below to sign in:</p>
                <a href="{magic_link}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Sign In</a>
                <p style="color: #666; font-size: 14px;">This link will expire in 5 minutes.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request this link, you can safely ignore this email.</p>
            </div>
            """
        }
        
        # Send email using Resend
        resend.Emails.send(params)
        
        # For development, also print the link to console
        print(f"Magic link for {email}: {magic_link}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.post("/auth/magic-link")
async def create_magic_link_route(email_request: EmailRequest):
    magic_link = create_magic_link(email_request.email)
    if send_magic_link(email_request.email, magic_link):
        return {"message": "Magic link sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send magic link")

@app.post("/auth/verify")
async def verify_token(request: TokenRequest):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Prompt Generator API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/generate", response_model=PromptResponse)
async def generate_response(request: PromptRequest):
    try:
        # Generate response using Gemini
        response = model.generate_content(request.prompt)
        
        # Return the generated text
        return PromptResponse(response=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: PromptRequest):
    try:
        # Start a chat session
        chat = model.start_chat(history=[])
        response = chat.send_message(request.prompt)
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
