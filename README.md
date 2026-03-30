# backend_two

A Node.js / Express backend prototype for a social/community-style application.

This project combines several backend concerns in one codebase:

- **REST APIs with Express**
- **MySQL persistence with Sequelize**
- **real-time communication with Socket.IO**
- **web push notification subscription support**
- **user registration, login, and email verification flows**

It is best understood as a practical backend prototype rather than a polished production system.

## What the project does

The backend provides a foundation for handling:

- user signup and login
- email verification
- user/account data storage
- posts, chats, and documents
- push notification subscriptions
- real-time event delivery through Socket.IO

The code suggests an application that mixes social features, user networks, messaging, and notification-driven interactions.

## Main technologies

- **Node.js**
- **Express**
- **Sequelize**
- **MySQL**
- **Socket.IO**
- **Web Push**
- **Nodemailer**
- **CORS / JSON API handling**

## Project structure

### Server entry
- `server.js`  
  Main backend entry point. Sets up Express, CORS, JSON parsing, Socket.IO, route registration, database sync, and push configuration.

### Models
- `app/models/index.js`  
  Initializes Sequelize and registers the application's models.
- `app/models/user.model.js`  
  Defines the user schema.
- Additional models include:
  - tutorials
  - documents
  - posts
  - chats
  - post interactions
  - push subscribers

### Controllers
- `app/controllers/user.controller.js`  
  Handles user creation, login, verification, referral-style ID generation, account lookup, and related user logic.
- Push controllers are used for browser push subscription handling.

### Routes
The backend registers multiple route groups, including:
- user routes
- tutorial routes
- document routes
- post routes
- chat routes
- push routes
- subscription routes

### Frontend-facing push demo
- `views/public/app.js`  
  Contains browser-side push subscription logic:
  - notification permission request
  - service worker registration
  - push subscription creation
  - sending subscription data back to the backend

## Features visible in the code

### 1. REST API backend
The server exposes multiple application routes and basic API structure through Express.

### 2. Database-backed user system
User data is stored with Sequelize/MySQL, including fields such as:
- name
- surname
- nickname
- email
- password
- city
- role/permission
- verification status
- reference IDs
- phone
- birth date
- profile image info
- point / generation-style fields

### 3. Email verification flow
The backend includes logic for:
- generating verification links
- sending verification email through a mail sender abstraction
- marking users as verified

### 4. Push notification subscription flow
The codebase includes:
- browser-side push subscription registration
- backend subscription endpoints
- web-push-related route structure

### 5. Real-time communication
Socket.IO is initialized alongside the HTTP server, suggesting support for:
- live updates
- messaging
- collaborative or event-driven features

### 6. Multi-feature backend design
This is not just a login API or CRUD sample. The codebase tries to support a wider application scope, including:
- user relationships
- content
- chat
- documents
- notifications

## What is interesting here

This repo is meaningful because it shows a developer trying to build a backend that handles several real product concerns at once rather than only a small tutorial API.

The interesting part is not code polish, but scope:

- authentication / onboarding logic
- persistence
- notification support
- real-time layer
- multiple data models
- application-oriented routing

That makes it more substantial than a basic Express starter project.

## Limitations

- The codebase is rough and not yet cleanly modularized.
- Some files, especially the user controller, are oversized and mix too many responsibilities.
- There are hardcoded values and environment-specific paths that should be externalized.
- Security, configuration management, and production readiness would need significant improvement before real deployment.
- Some naming and architecture decisions reflect active prototyping more than finished backend design.

## Best way to understand this repo

Think of this as:

**an early full-featured backend prototype for a social/community web application**, built with Node.js, Express, Sequelize, Socket.IO, and push notification support.

It is stronger as evidence of practical backend experimentation than as a polished production portfolio piece.

## Future improvements

- split large controllers into service layers
- move secrets and environment-specific values into configuration
- document all route groups clearly
- add setup instructions and database bootstrapping notes
- improve folder organization and naming consistency
- add authentication / authorization notes explicitly
- include example API requests

## Summary

`backend_two` is a meaningful backend prototype that combines:

- Express REST APIs
- MySQL persistence via Sequelize
- Socket.IO real-time support
- push-notification subscription flow
- user/account verification logic
- multi-model application design
