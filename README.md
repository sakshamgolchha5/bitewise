# Bitewise — Indian calorie & protein tracker

An installable mobile-first web app (PWA) plus a tiny Node server. **No npm packages are required.**

For the free tester build, Bitewise uses:

- **Gemini 2.5 Flash-Lite** for food-photo, label, voice-sentence and custom-food AI.
- **Google Search grounding** for custom-food estimates when web information can improve the answer.
- **Open Food Facts** for packaged-product/barcode lookups.
- Local browser storage for each tester's food log, profile, saved meals and corrections.
- Optional USDA is intentionally **not required** in this build.

## 1. Run locally

```bash
cp .env.example .env
# put your GEMINI_API_KEY in .env
export $(grep -v '^#' .env | xargs)
npm run build
node server.js
```

Open `http://localhost:3000`.

Get a Gemini API key from Google AI Studio. New API keys are managed there; keep the key on the server and never commit it to GitHub.

## 2. Deploy for a small free test

**Recommended: Render Free Web Service.** The included `render.yaml` is already configured for a free Node web service.

1. Push the repository to GitHub.
2. In Render choose **New → Blueprint**.
3. Select the GitHub repository.
4. Blueprint path: `render.yaml`.
5. Set `GEMINI_API_KEY` to your Google AI Studio key.
6. Set `CONTACT_EMAIL` to your email.
7. Leave the AI limits/model values as supplied for the initial 20–30 person test.
8. Deploy.
9. Open the resulting `https://...onrender.com` URL on Android Chrome.
10. Use Chrome menu → **Install app** / **Add to Home screen**.

Render's free web services are intended for testing/hobby use, can spin down after 15 minutes of inactivity, and have monthly usage limits. The first request after a sleep can take about a minute.

## 3. AI/free-test design

The server never exposes the Gemini key to the browser. It forwards the selected image/text to Gemini and returns the structured result.

The default test protection is:

- 15 AI requests per IP per day
- 3 AI requests per IP per minute
- Gemini model: `gemini-2.5-flash-lite`

These are **app-level safeguards**, not guarantees of Gemini's project quota. Gemini rate limits are applied at the project level and Google can change the active limits shown in AI Studio.

## 4. What needs the server

| Feature | Free-test implementation |
|---|---|
| Photo → thali/food recognition | Gemini multimodal AI |
| Nutrition-label photo | Gemini multimodal AI |
| Voice food sentence parsing | Browser speech recognition → Gemini text parsing |
| Custom food estimate | Open Food Facts + Gemini + optional Google Search grounding |
| Barcode → product | Open Food Facts |
| Manual food logging | On-device; no server required |
| Daily/monthly history | On-device; no server database required |
| Saved foods/meals/corrections | On-device |

Every AI result is shown for user confirmation before it is logged.

## 5. Data/privacy for the tester build

Food logs, profile information and saved meals are stored in the user's browser on their device. The server does not store the uploaded photos or prompts.

Photos/text deliberately sent for AI analysis are sent to Gemini. Barcode searches go to Open Food Facts. Custom-food estimates may use Google Search grounding. Review the provider terms/privacy information before a wider public launch.

A simple privacy notice is included at `/privacy.html`.

## 6. Native Android/iOS app

Do this later. For a 20–30 person test, the PWA is much easier and costs nothing to publish to an app store.

## 7. Tests

```bash
npm run build
node --check server.js
bash tests/api-test.sh
```

The API test uses local mock Gemini/Open Food Facts servers, so it does not consume a real API key or internet quota.
