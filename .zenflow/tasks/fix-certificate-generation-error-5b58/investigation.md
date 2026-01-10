# Bug Investigation: Certificate URL Returns 404

## Bug Summary
When accessing certificate URLs like `https://kesslergame.vercel.app/certificate/2ede270d-f146-4ff6-8fec-73dd4e12b4c9`, users receive a 404 error from Vercel instead of seeing the certificate page.

**Error Details:**
- HTTP Status: 404 NOT_FOUND
- Error Code: NOT_FOUND
- Error ID: fra1::swzsx-1768081755696-db69f334a514

## Root Cause Analysis

The application is a React SPA (Single Page Application) built with Vite and deployed on Vercel. It uses React Router for client-side routing:

1. **Client-Side Route Defined**: The route `/certificate/:id` is configured in `src/App.tsx:773` to render `CertificateRetrievalPage`

2. **Missing SPA Configuration**: The `vercel.json` file only contains function configuration but lacks the `rewrites` configuration needed for SPA routing

3. **What Happens**:
   - User accesses `/certificate/[id]` 
   - Vercel tries to find a file at that path
   - No file exists (it's a client-side route)
   - Vercel returns 404 before the React app can load
   - React Router never gets a chance to handle the route

4. **Expected Flow**:
   - User accesses `/certificate/[id]`
   - Vercel serves `index.html`
   - React app loads and React Router handles the route
   - `CertificateRetrievalPage` component renders
   - Component fetches certificate data from `/api/certificates/[id]`
   - Certificate is displayed to the user

## Affected Components

- **vercel.json**: Missing SPA rewrite configuration
- **User Experience**: Certificate links from QR codes are broken
- **API Endpoint**: `/api/certificates/[id].ts` is working correctly but unreachable via web UI

## Proposed Solution

Add a `rewrites` configuration to `vercel.json` that:
1. Serves `index.html` for all routes except API routes
2. Preserves API functionality at `/api/*`
3. Allows React Router to handle all client-side routes

**Configuration to add:**
```json
{
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

This regex pattern `/((?!api).*)` matches all routes except those starting with `/api`, ensuring:
- `/certificate/[id]` → serves `index.html` (React app handles routing)
- `/api/certificates/[id]` → continues to work as serverless function
- All other routes → serve `index.html` (SPA behavior)

## Edge Cases Considered

- API routes must continue to work: ✅ Pattern excludes `/api/*`
- Static assets must load: ✅ Vite handles these correctly
- Root route `/` must work: ✅ Pattern includes root
- Direct navigation to certificate URLs: ✅ Will now load the SPA
- QR code links: ✅ Will now work correctly

## Testing Strategy

1. Deploy the fix to Vercel
2. Test certificate URL directly: `https://kesslergame.vercel.app/certificate/2ede270d-f146-4ff6-8fec-73dd4e12b4c9`
3. Verify API endpoint still works: `https://kesslergame.vercel.app/api/certificates/2ede270d-f146-4ff6-8fec-73dd4e12b4c9`
4. Test root route still loads: `https://kesslergame.vercel.app/`
5. Test QR code scanning flow end-to-end
