# Chat App

A real-time chat application built with Django, Django Channels, and Next.js.

[Link to live app](https://django-nextjs-chat.vercel.app/)

## App Structure

- Each server belong to a category
- Channels belong to servers (server can have multiple channels)
- User who creates a server is server owner
- Users can send messages in channels

## Features

- User authentication and registration
- Real-time messaging
- Server owner can create and manage channels, servers, and users (kick, ban)
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS and Redux
- **Backend:** Django, Django Channels, Django REST Framework
- **Database:** PostgreSQL (neon for production, docke for dev)
- **Message broker:** Redis (Redi cloud for production, docker for dev)
- **Cloud Storage:** Cloudflare R2 for file uploads
- **Deployment:** Django Backend on DigitalOcean, Next.js Frontend on Vercel

## Getting Started

### Prerequisites

- Node.js (version)
- Python (version)
- Docker and Docker Compose (if run locally)

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/nevalearntocode/dj_chat.git
    ```

2. **Install frontend dependencies**
    ```bash
    cd frontend
    npm install
    ```

3. **Set up environment variables**
    - Create `.env.local` file in frontend and `.env.dev` file backend directory.
    - Follow the .env.example files in frontend and backend directory.

### Running with Docker

- In settings.py, comment out the following lines: 82 and 89. Then uncomment the following line: 83
- ![Redis and Database Configs](/images/redis-and-database-configs.png)

### Running the Application

- **Frontend**: Run `npm run dev` in the frontend directory.
- **Backend**: Run `docker compose up --build` in the backend directory.

### Deployment

- The following Github repo is a guide to how to deploy the application with separate PostgreSQL database and Redis service.
- [Deloyment guide](https://github.com/mitchtabian/HOWTO-django-channels-daphne)
- Notes: I'm using Uvicorn instead of Daphne and Next.js Frontend instead of Fullstack Django. Please refer to the guide as you see fit.

## Images

### Home Page
![home page](/images/home-page.png)

### Server Page
![server page](/images/server-landing-page.png)

### Chat interface
![chat interface](/images/chat-interface.png)

### Search Pages
![search 1](/images/search.png)
![search 2](/images/search-2.png)

## Mobile

### Home Page
![mobile home page 1](/images/mobile-home-page.png)
![mobile home page 2](/images/mobile-home-page-2.png)

### Mobile Chat Interface
![mobile chat interface](/images/mobile-chat-interface.png)

### Mobile Server Page
![mobile server page](/images/mobile-server-landing-page.png)