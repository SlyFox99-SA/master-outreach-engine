# How to update your website

No code. No logins. Just edit one file.

## What you can change

- Product names
- Prices
- Descriptions
- Images
- WhatsApp number
- Hero headline

## How to change a price

1. Open `data/config-YOUR-BRAND.json` on GitHub (click the pencil icon)
2. Find `"price": 450` - change the number
3. Scroll to bottom, click **Commit changes**
4. Your website updates in 90 seconds

## How to change an image

1. Upload your photo somewhere free (Imgur, Cloudinary, Google Drive with public link)
2. Copy the image URL
3. In `config-YOUR-BRAND.json`, replace the `"image": "https://..."` with your URL
4. Commit changes

## How to add a product

Copy an existing `{ ... }` block, paste after it, change the values, add a comma.

## What NOT to touch

- Anything outside `data/config-YOUR-BRAND.json`
- The `.github` folder
- Any file ending in `.js`, `.html`, `.css`

## If something breaks

You will get an email from GitHub saying the build failed. Reply to that email or message your developer. The old version stays live - nothing goes down.
