# Deployment Troubleshooting

## MIME Type Issues on Netlify

If you see CSS not loading due to MIME type errors, follow these steps:

### 1. Clear Browser Cache
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Or open Developer Tools > Network tab > check "Disable cache"

### 2. Trigger New Deployment
After updating the configuration files, trigger a new build:

```bash
# Make a small change to trigger rebuild
git add .
git commit -m "Fix MIME types for Netlify"
git push
```

### 3. Manual Redeploy
In Netlify Dashboard:
1. Go to your site
2. Click "Deploys" tab
3. Click "Trigger deploy" > "Clear cache and deploy"

### 4. Check Build Output
Ensure build completes successfully:
- No errors in build log
- CSS files are in `/assets/` directory
- Correct file extensions (.css, .js)

### 5. Alternative: Use Different Base URL
If issues persist, you can try:

```js
// vite.config.js
export default defineConfig({
  base: './', // relative paths instead of absolute
  // ... rest of config
})
```

## Files Added to Fix MIME Issues:
- `public/_headers` - Netlify headers configuration
- `netlify.toml` - Updated with proper headers
- `vite.config.js` - Improved build configuration

## Expected Behavior After Fix:
- CSS loads properly
- App displays with correct styling
- No MIME type errors in browser console
- PWA functionality works

If issues persist, check Netlify build logs for any errors during the build process.