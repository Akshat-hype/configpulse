## 📁 Project Structure
```
configpulse/
├── client/                                          # React frontend — admin dashboard UI
│   ├── public/                                      # Static assets served directly by browser
│   │   └── index.html                               # Root HTML file, React mounts here
│   │
│   ├── src/                                         # All React source code lives here
│   │   ├── pages/                                   # Full page components mapped to routes
│   │   │   ├── Dashboard.jsx                        # Home screen — active clients, system health, recent changes overview
│   │   │   ├── ConfigEditor.jsx                     # JSON editor UI to create, edit, and publish configs
│   │   │   ├── Environments.jsx                     # View and switch between dev, staging, production configs
│   │   │   ├── Clients.jsx                          # Live list of all connected clients with metadata
│   │   │   └── Logs.jsx                             # Displays validation results, deployment history, errors
│   │   │
│   │   ├── components/                              # Reusable UI building blocks used across pages
│   │   │   ├── Sidebar.jsx                          # Left navigation panel with links to all pages
│   │   │   ├── Navbar.jsx                           # Top bar — app name, environment indicator, user info
│   │   │   ├── ConfigCard.jsx                       # Card component to display a single config entry
│   │   │   ├── ClientBadge.jsx                      # Small badge showing a client's live connection status
│   │   │   ├── EnvSwitcher.jsx                      # Dropdown/toggle to switch active environment context
│   │   │   └── ValidationAlert.jsx                  # Red/yellow alert box to show validation errors or warnings
│   │   │
│   │   ├── hooks/                                   # Custom React hooks for shared logic
│   │   │   ├── useWebSocket.js                      # Hook to connect to WebSocket and listen for live config updates
│   │   │   └── useConfig.js                         # Hook to fetch, cache, and manage config data from backend
│   │   │
│   │   ├── services/                                # API communication layer
│   │   │   └── api.js                               # Axios instance with all backend API call functions (GET, POST, PUT)
│   │   │
│   │   ├── store/                                   # Global client-side state management
│   │   │   └── configStore.js                       # Zustand store — holds configs, env, client state globally
│   │   │
│   │   └── App.jsx                                  # Root React component — sets up routing and layout
│   │
│   ├── .env                                         # Frontend env variables (e.g., VITE_API_URL, WS_URL)
│   └── package.json                                 # Frontend dependencies and scripts (React, Axios, etc.)
│
├── server/                                          # Node.js + Express backend — core config server
│   ├── src/                                         # All backend source code
│   │   ├── api/                                     # HTTP layer — routes and middlewares
│   │   │   ├── routes/                              # Defines all API endpoints
│   │   │   │   ├── config.routes.js                 # GET /config — serves resolved config to client apps
│   │   │   │   ├── admin.routes.js                  # POST/PUT/DELETE routes for admin config management
│   │   │   │   └── health.routes.js                 # GET /health — checks if server is alive and DB is connected
│   │   │   │
│   │   │   └── middlewares/                         # Request interceptors that run before controllers
│   │   │       ├── auth.middleware.js               # Verifies client API key or JWT before allowing access
│   │   │       └── validate.middleware.js           # Validates incoming request body structure and required fields
│   │   │
│   │   ├── controllers/                             # Handles request/response logic for each route
│   │   │   ├── config.controller.js                 # Calls resolver service and returns final merged config to client
│   │   │   └── admin.controller.js                  # Handles admin CRUD operations — create, update, delete configs
│   │   │
│   │   ├── services/                                # Core business logic layer
│   │   │   ├── config.service.js                    # Fetches raw configs from MongoDB for a given client request
│   │   │   ├── resolver.service.js                  # Merges configs in order: global → env → location → client override
│   │   │   └── notifier.service.js                  # Broadcasts config change events to all connected WebSocket clients
│   │   │
│   │   ├── models/                                  # MongoDB data schemas
│   │   │   ├── config.model.js                      # Schema for storing config entries with version, scope, and metadata
│   │   │   └── client.model.js                      # Schema for tracking registered clients and their metadata
│   │   │
│   │   ├── watcher/                                 # File system monitoring — detects local config file changes
│   │   │   ├── file.watcher.js                      # Uses Node.js fs.watch (Unix File Watch API) to monitor config folder
│   │   │   └── change.handler.js                    # On file change — triggers validation script then deployment pipeline
│   │   │
│   │   ├── websocket/                               # Real-time communication layer
│   │   │   └── ws.server.js                         # Sets up WebSocket server, manages client connections and broadcasts
│   │   │
│   │   └── app.js                                   # Initializes Express app, registers all routes and middlewares
│   │
│   ├── configs/                                     # Raw JSON config files organized by scope
│   │   ├── global.json                              # Base config applied to every client — lowest priority
│   │   ├── environments/                            # Environment-specific overrides — overrides global
│   │   │   ├── dev.json                             # Config values for development environment
│   │   │   ├── staging.json                         # Config values for staging/QA environment
│   │   │   └── production.json                      # Config values for live production environment
│   │   ├── locations/                               # Region-based overrides — overrides environment config
│   │   │   ├── india.json                           # Config overrides for clients in India region
│   │   │   ├── us.json                              # Config overrides for clients in United States region
│   │   │   └── eu.json                              # Config overrides for clients in European region
│   │   └── clients/                                 # Client-specific overrides — highest priority
│   │       └── enterprise-client-1.json             # Custom config for a specific enterprise client ID
│   │
│   ├── scripts/                                     # Shell scripts for config lifecycle management
│   │   ├── validate-config.sh                       # Validates JSON schema, required fields, and unsafe values before deploy
│   │   ├── deploy-config.sh                         # Pushes validated config files into MongoDB and notifies watchers
│   │   └── rollback-config.sh                       # Uses Git to revert configs to a previous working state
│   │
│   ├── db/                                          # Database setup and initialization
│   │   ├── connection.js                            # Creates and exports MongoDB connection using Mongoose
│   │   └── seed.js                                  # Seeds the database with initial default config data for first run
│   │
│   ├── .env                                         # Backend secrets — MongoDB URI, PORT, JWT secret, API keys
│   └── server.js                                    # Entry point — starts HTTP server, WebSocket, and file watcher
│
├── tests/                                           # Automated test suite for backend logic
│   ├── config.resolver.test.js                      # Unit tests for hierarchical config merge and override logic
│   ├── config.api.test.js                           # Integration tests for all REST API endpoints
│   └── watcher.test.js                              # Tests that file watcher correctly detects changes and triggers pipeline
│
├── docs/                                            # Project documentation
│   └── PRD.md                                       # Original Product Requirement Document for ConfigPulse
│
├── docker-compose.yml                               # Spins up frontend, backend, and MongoDB together with one command
├── .gitignore                                       # Files and folders excluded from Git (node_modules, .env, etc.)
└── README.md                                        # Project overview, setup instructions, and usage guide
```

<img src='./architecture_diagram 1.png'>


#Backend run &test

# 1 — Install missing dep (cors)
cd server
npm install cors

# 2 — Seed the database
npm run seed

# 3 — Start the server
npm run dev
```

Then hit these URLs in Postman or browser:
```
# Health check
GET http://localhost:5000/api/health

# Global only (no client/location)
GET http://localhost:5000/api/config?environment=production

# With location (gets India override)
GET http://localhost:5000/api/config?environment=production&location=india

# Full resolution (enterprise client gets 20s timeout)
GET http://localhost:5000/api/config?environment=production&location=india&clientId=enterprise-client-1