# Security Memory - Rovya Simulation

## Constraints
- **Zero Real Integration**: No real backend, database, WebSocket, telephony (VoIP/PSTN), authentication (Auth0/Firebase), GPS (Google Maps API), payment gateways (Stripe/Pix), or push notifications should be connected.
- **Simulated Privacy**: All user data, location, and communication must remain local to the browser's `localStorage` and state.
- **Transparent Simulation**: UI elements that suggest real functionality (like call buttons) must be clearly labeled as simulations (`aria-label="Abrir simulação de chamada"`).
- **Deterministic UI**: Dates and times in simulations should be deterministic (ISO strings or fixed formats) to avoid hydration mismatches and ensure consistent demonstration behavior.
