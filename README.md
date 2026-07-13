# Vixel Network

Vixel Network is a modern, immersive web experience for a Minecraft-themed community server. Built with React, TypeScript, Vite, and Express, this project brings together community engagement, announcements, store browsing, support resources, and Discord integration in a polished single-page application.

This platform is designed to feel fast, premium, and visually rich while remaining easy to maintain and extend. It provides a public-facing website for players and visitors, along with community tools such as announcement posting, news collection, and support-related content.

## Overview

Vixel Network combines the following core experiences:

- A visually striking landing experience with animated branding and rich UI
- A community-focused hub featuring announcements and Discord live information
- A store section for products and server-related offerings
- A support center for community assistance and engagement
- A lightweight content management experience for announcements/news
- Secure and flexible authentication flow through Discord integration

## Project Highlights

- Modern front-end architecture using React and React Router
- TypeScript for safer development and maintainability
- Vite-powered development workflow for quick iteration
- Express-based server support for backend functionality
- Responsive design that works across desktop and mobile devices
- Tailored design language inspired by gaming and creator communities

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion animation library
- Lucide icons

### Backend / Server
- Express
- Node.js
- dotenv for environment configuration
- cookie-parser and CORS support

## Features

### Home Experience
The home page serves as the central entry point for the brand. It includes:
- a hero section with animated branding
- a Discord server widget and online member count
- featured announcements
- support and community highlights

### Community Section
The community page is built to keep players connected and informed. It presents community-related content, engagement opportunities, and a polished interface for social discovery.

### Store Section
The store experience is designed for users who want to explore products, services, or in-game offerings from the network in a structured format.

### Support Section
The support page helps users find help and connect with the wider Vixel Network community.

### Announcement Tools
The project also includes internal-style tools for creating announcements and managing news content, giving the platform a content-driven layer that is useful for server operators and community managers.

## Project Structure

The repository is organized as follows:

- src/ - application source code and UI components
- src/pages/ - main route pages such as Home, Community, Store, Support, and more
- src/components/ - reusable UI elements and icons
- public/ - static assets such as images and branding files
- server.ts - Express server entry point
- vite.config.ts - Vite configuration
- package.json - project scripts and dependency list

## Installation

### Prerequisites
Make sure you have the following installed:

- Node.js 18+ or newer
- npm or a compatible package manager

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/msxfury/Vixel-Network.git
   cd Vixel-Network
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a local environment file if required by your setup:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available locally in your browser.

## Available Scripts

- npm run dev - starts the development server
- npm run build - builds the production bundle
- npm run start - starts the production server build
- npm run lint - runs TypeScript checks
- npm run clean - removes build artifacts

## Environment Notes

Depending on your deployment and authentication setup, you may need environment variables for API access and Discord-related flows. Ensure the required values are configured before running the app in a full environment.

## Deployment

This project is structured for modern deployment platforms such as:
- Vercel
- Render
- Railway
- traditional Node.js hosting environments

The included configuration files and build pipeline make it suitable for both local development and production deployment.

## Contributing

Contributions are welcome. If you would like to improve the project, please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes clearly
4. Open a pull request with a concise explanation of your work

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For project-related questions, feedback, or collaboration opportunities, please reach out through the repository or associated community channels.
