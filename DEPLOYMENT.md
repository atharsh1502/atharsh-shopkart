# Deployment

ShopKart is configured for a split deployment: the React frontend on Netlify and
the Spring Boot API on Render.

## Deploy the API to Render

1. In Render, create a Blueprint from this GitHub repository and approve the
   `render.yaml` service.
2. Set `SHOPKART_FRONTEND_ORIGINS` to the exact public Netlify site origin
   (for example, `https://shopkart.example.netlify.app`). Do not include a path
   or trailing slash.
3. Wait for the service health check at `/actuator/health` to pass. Copy the
   API's public URL.

The API uses the repository's `backend/Dockerfile`. The container uses the Java
version required by the Maven project.

## Deploy the frontend to Netlify

1. Import the same GitHub repository into Netlify. It will read `netlify.toml`.
2. Set the `VITE_API_URL` environment variable to the Render API's public URL
   (for example, `https://shopkart-api.onrender.com`), without a trailing
   slash.
3. Trigger a deploy so the frontend build uses that API URL.

## Runtime limitations and optional configuration

- The Render free service uses an ephemeral filesystem. ShopKart's current H2
  file database can be reset when the service restarts or is redeployed. Use a
  persistent database before relying on hosted data.
- AI chat is disabled by default. To enable it, set `SHOPKART_AI_ENABLED=true`
  and add `OPENAI_API_KEY` as a secret in Render.
- The frontend's API URL is a build-time variable. Rebuild the Netlify site
  after changing it.
