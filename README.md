# backend_two

A Node.js / Express backend prototype for a social/community-style application.

This project combines several backend concerns in one codebase:

- **REST APIs with Express**
- **MySQL persistence with Sequelize**
- **real-time communication with Socket.IO**
- **web push notification subscription support**
- **user registration, login, and email verification flows**

It is best understood as a practical backend prototype rather than a polished production system.

## Project overview

`backend_two` appears to function as the **backend counterpart** of the `dupia` frontend project.

The codebase provides the backend foundation for handling:

- user signup and login
- email verification
- user/account data storage
- posts, chats, and documents
- push notification subscriptions
- real-time event delivery through Socket.IO

The overall structure suggests a social/community application that mixes user relationships, messaging, content, and collaboration features.

## Relationship to `dupia`

This repository is intended to serve the `dupia` frontend:

- this backend runs Socket.IO on port `4444`
- it listens for:
  - `getDoc`
  - `getAllDocs`
  - `addDoc`
  - `editDoc`

The `dupia` frontend connects to `http://localhost:4444` and emits those same exact events through its Angular document service.

That makes the pairing:

**`dupia` = frontend client**  
**`backend_two` = backend / API / real-time server**

In other words, `backend_two` is not just a random Express experiment — it looks like the service layer behind a broader frontend application.

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
  Main backend entry point. Sets up Express, CORS, JSON parsing, route registration, database sync, and Socket.IO listeners.

### Models
- `app/models/index.js`  
  Initializes Sequelize and registers the application models.
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
- Push-related controllers handle browser push subscription flows.
- Document and other domain controllers support the real-time and REST layers.

### Routes
The backend registers multiple route groups, including:
- user routes
- tutorial routes
- document routes
- post routes
- chat routes
- push routes
- subscription routes

### Real-time document layer
- `app/routes/document.routes.js`  
  Implements Socket.IO document events used by the frontend:
  - `getDoc`
  - `getAllDocs`
  - `addDoc`
  - `editDoc`

This is the clearest integration point between `backend_two` and `dupia`.

### Frontend-facing push demo
- `views/public/app.js`  
  Contains browser-side push subscription logic:
  - notification permission request
  - service worker registration
  - push subscription creation
  - sending subscription data back to the backend

## Features visible in the code

### 1. REST API backend
The server exposes multiple application routes and API structures through Express.

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
Socket.IO is initialized separately from the HTTP API server and used for:
- live updates
- collaborative document handling
- messaging/event-driven features

### 6. Multi-feature backend design
This is not just a login API or CRUD sample. The codebase tries to support a wider application scope, including:
- user relationships
- content
- chat
- documents
- notifications

## Why this repo is meaningful

This repo is meaningful because it shows a developer trying to build a backend that handles several real product concerns at once rather than only a small tutorial API.

The interesting part is not code polish, but scope:

- authentication / onboarding logic
- persistence
- notification support
- real-time layer
- multiple data models
- application-oriented routing
- clear coupling to a separate frontend project

That makes it more substantial than a basic Express starter project.

## Limitations

- The codebase is rough and not yet cleanly modularized.
- Some files, especially the user controller, are oversized and mix too many responsibilities.
- There are hardcoded values and environment-specific paths that should be externalized.
- Security, configuration management, and production readiness would need significant improvement before real deployment.
- Some naming and architecture decisions reflect active prototyping more than finished backend design.

## Local development

This project appears intended to run alongside the `dupia` frontend.

Typical setup idea:

1. configure the database
2. start the Express backend
3. make sure the API server and Socket.IO server are running
4. run `dupia` separately as the frontend client
5. keep Socket.IO available on port `4444` for real-time features

## Best way to understand this repo

Think of this as:

**an early full-featured backend prototype for a social/community web application, built to support the `dupia` frontend with APIs, persistence, and real-time collaboration**

It is stronger as evidence of practical backend experimentation than as a polished production portfolio piece.

## Future improvements

- split large controllers into service layers
- move secrets and environment-specific values into configuration
- document all route groups clearly
- add setup instructions and database bootstrapping notes
- improve folder organization and naming consistency
- add authentication / authorization notes explicitly
- include example API requests
- document the frontend integration contract with `dupia`

## Summary

`backend_two` is a meaningful backend prototype that combines:

- Express REST APIs
- MySQL persistence via Sequelize
- Socket.IO real-time support
- push-notification subscription flow
- user/account verification logic
- multi-model application design

It is best understood as the backend side of a broader social/community application prototype, paired with the `dupia` frontend.
