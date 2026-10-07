# Client Template

Copy this folder to clients/<new-client-name>/ to onboard a client.

## Steps

1. Copy: Copy-Item -Recurse clients/_TEMPLATE clients/my-new-client
2. Edit src/config.json with brand details
3. Copy a shell: Copy-Item templates/shells/editorial/index.html clients/my-new-client/src/index.html
4. Copy shared files: main.js, style.css, checkout.html from a working client
5. Build: ./scripts/Build-Client.ps1 -Client my-new-client
6. Test locally, then deploy

## Files

- src/index.html      storefront HTML from a shell
- src/checkout.html   checkout page
- src/main.js         cart engine
- src/style.css       styles
- src/config.json     brand data (fill this in first)
- seller/index.html   admin panel
- track/index.html    order tracking
- DEPLOYS.md          deploy log

## Nothing outside this folder is referenced. Copy it anywhere and it works.
