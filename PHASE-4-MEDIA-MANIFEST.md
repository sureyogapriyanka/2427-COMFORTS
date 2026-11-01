# 2427 ÉLAN — Phase 4 Media Generation Manifest

## Current asset audit

- `public/images/home/hero-campaign.webp` and `hero-poster.webp` are local, optimized landscape images of a clothing rack. The rack image has been rejected for the homepage hero; both source files remain untouched and are no longer used there.
- Temporary homepage campaign assets have been cropped from the client-approved design reference and saved in `public/images/home/approved-reference-crops/`. The hero crop contains the approved adult models and neutral studio scene; each of the four card crops contains campaign photography/product imagery only, with headings and buttons excluded. These crops are reference-derived assets, not separately generated photography.
- `men-collection.webp` and `women-collection.webp` are local lifestyle portraits, but do not clearly present the corresponding innerwear collections. The homepage collection cards now use actual catalog product images instead; the existing lifestyle files remain untouched.
- Existing catalog photography is unchanged except for the `w-ct15` concept preview mapping below. The new front/back derivatives are AI-generated concept visuals from a user-supplied sample, not verified photographs of the listed product.
- The `w-ct15` catalog product (`2427 Collared Crop Top`) still requires owner-approved product photography. Its prior source, `women-crop-tops/w-ct15-back.jpg`, includes a partial neighboring image and embedded filename text and remains excluded from customer-facing galleries. A filename search of the unprotected project product-image directories found no alternate matching asset.
- The user-supplied `collared-crop-top-sample.png` is preserved at `public/images/products/womens-concepts/w-ct15-sample-original.png`. Its title and bottom labels were removed from the separate `w-ct15-front-concept.webp` and `w-ct15-back-concept.webp` derivatives in that folder; the original was not altered. These concepts depict a mauve top with visible chest branding, unlike the catalog's listed sky-blue color. Customer-facing labels must state that the visuals are AI-generated concepts and that color, branding, fit, and other details are unverified and may differ. Do not treat them as saleable-product evidence or as replacements for approved product photographs.
- `public/videos/` has no available campaign videos. The hero previously referenced a non-existent `videos/hero-campaign.mp4`; that reference was removed rather than leaving a broken request.
- The `reference/` folder contains no files. The repository root includes a user-provided MP4 recording, which is reference material and is not being integrated as campaign media.

## Image generation requirements

These are generation briefs only. No image-generation service was available during implementation, so none of the assets below have been generated. Do not use these prompts to invent product details. For product photography, attach the corresponding existing 2427 product image as a visual reference and preserve its silhouette, color, construction, and visible details. Do not use or upload the image backup/preview directories.

### Product studio image briefs

For each requested product image, output a clean, high-resolution studio photograph with a warm-white or pale-neutral seamless background, soft diffuse lighting, realistic fabric texture, accurate color, no text, no watermark, no packaging, no props obscuring the garment, and no stretching. Center the full garment with generous, even margins. Create separate front and back views where those source views exist. Follow the attached 2427 product reference exactly; do not add seams, logos, trims, colors, or features not visible in the reference.

| Category | Suggested reference filenames | Prompt-specific direction |
|---|---|---|
| Men's Underwear | `m-ub01-front.jpg`, `m-ub01-alt.jpg` | Photograph the referenced brief or trunk laid flat or on an invisible form, preserving waistband width, leg opening, rise, and actual color. Front view first; clean rear or construction-detail view second. |
| Men's Boxers | `m-bx01-airbox-front.jpg`, `m-bx01-airbox-alt.jpg` | Photograph the exact referenced woven boxer silhouette, waistband, fly, and pinstripe/solid pattern. Keep the complete shorts visible and undistorted; second view should show the rear construction. |
| Men's Vests | `m-v01-front.jpg`, `m-v01-alt.jpg` | Photograph the exact sleeveless undershirt with its existing neckline and armholes visible. Preserve the reference fabric color and texture; use a matching back view as the alternate. |
| Men's Sleeveless Essentials | `m-s01-front.jpg`, `m-s01-back.jpg` | Photograph the exact sleeveless top and rib or knit texture shown by the reference. Keep the hem and shoulders fully in frame, with a consistent front/back camera angle. |
| Women's Bras | `w-b01-front.jpg`, `w-b01-back.jpg` | Photograph the exact bra or bralette in the reference, accurately showing cup shape, strap width, band, and color. Use a neutral, non-suggestive product-only studio presentation; no model is required. |
| Women's Underwear | `w-u01-front.jpg`, `w-u01-back.jpg` | Photograph the exact brief silhouette, waistband, leg openings, gusset coverage as visible, and actual color from the reference. Full garment visible, front and rear views. |
| Women's Camisoles | `w-c01-front.jpg`, `w-c01-back.jpg` | Photograph the referenced camisole with its actual strap width, neckline, length, and color. Keep the fabric drape natural and include the full garment. |
| Women's Crop Tops | `w-ct01-front.jpg`, `w-ct01-back.jpg` | Photograph the referenced crop-top style accurately, preserving neckline, sleeves, length, seams, and color. For the collared style `w-ct15`, create a clean front view matching the existing blue back-view asset. |

Use these briefs per catalog SKU only when its corresponding current image is attached. Do not reuse one SKU's generated result for another SKU. Export square or 4:5 portrait assets at a minimum of 1600 pixels on the longest edge, in WebP or high-quality JPEG, and confirm image rights and product accuracy before replacing any existing file.

## Homepage and collection campaign image briefs

Global direction for all six: original premium apparel campaign for 2427 ÉLAN; warm ivory, oatmeal, soft charcoal, and natural skin tones; precise editorial composition; soft directional studio light; refined but understated; generous negative space for accessible HTML copy; no typography, symbols, logos, watermarks, or product claims baked into the pixels. Show only products and styling supplied/approved by 2427 ÉLAN. Do not imitate another brand's recognizable campaigns or compositions.

| Asset | Intended location | Prompt |
|---|---|---|
| `elan-home-hero.webp` | Homepage hero (future asset) | Wide landscape campaign, 2.5:1 composition. Show adult male and female models in tasteful, non-suggestive styling with approved 2427 ÉLAN innerwear, accurately matching the supplied product references. Warm ivory and soft charcoal studio setting, elegant natural light, premium editorial photography, generous negative space for accessible HTML headline and two CTAs; no clothing rack, text, logos, watermarks, or third-party labels. |
| `elan-men-edit.webp` | Men's collection card/banner | Wide 3:2 campaign still. An adult male model in neutral, opaque everyday layering, cropped from shoulder to mid-thigh with relaxed natural posture; tactile fabric and fit are the focus, tasteful and non-suggestive; leave lower-left negative space for HTML title and CTA. |
| `elan-women-edit.webp` | Women's collection card/banner | Wide 3:2 campaign still. An adult female model in neutral, opaque everyday layering, cropped from shoulder to mid-thigh with relaxed natural posture; fabric hand and silhouette are the focus, tasteful and non-suggestive; leave lower-left negative space for HTML title and CTA. |
| `elan-new-arrivals.webp` | New Arrivals merchandising banner | Wide 3:2 still featuring a small, considered arrangement of only approved current catalog pieces in a fresh soft-sage and warm-white palette; tactile ribbed fabric, subtle depth, clean negative space for HTML copy. |
| `elan-bestsellers.webp` | Bestsellers merchandising banner | Wide 3:2 still with a refined editorial arrangement of only approved bestseller catalog pieces, neatly composed on a pale warm-neutral surface; clear product separation and negative space for HTML copy. |
| `elan-everyday-comfort.webp` | Everyday Comfort collection banner | Wide 3:2 lifestyle still with a softly lit neutral bedroom/wardrobe environment, natural linen texture, and approved essentials folded or on hangers; calm, uncluttered, product-first, with negative space for HTML copy. |

Create each banner in a 2400 × 1000 px master and a 1200 × 1500 px mobile crop. Keep all meaningful product detail inside the central safe area so object-position changes do not hide it. The mobile crop must be separately art-directed rather than blindly center-cropped.

## Promotional video production plans

All footage must be newly produced or generated under a license that explicitly allows commercial website use. These are storyboards and prompts, not completed videos. Do not include claims, testimonial language, competitor imagery, or unsupported garment benefits. Render an edit master in 16:9 and a separately framed 9:16 cutdown for social/mobile use. Add brand text/logo in the edit, not through generated text.

### 1. Homepage brand film

- **Filename:** `elan-brand-film-15s.mp4`
- **Duration / aspect:** 15 seconds; 16:9 master, 9:16 cutdown.
- **Website location:** `public/videos/elan-brand-film-15s.mp4`, homepage hero only after review and approval.
- **Storyboard:** 0–3s: morning light across natural ivory fabric; 3–6s: close-up of a hand gently lifting a folded approved essential; 6–10s: adult models in opaque neutral everyday layers moving naturally through a bright interior; 10–13s: controlled macro detail of an approved seam and knit surface; 13–15s: clean neutral end frame for the 24 | 27 mark and “2427 ÉLAN”.
- **Generation prompt:** “Create an original 15-second premium minimalist apparel brand film for 2427 ÉLAN. Warm natural light, considered camera movement, tactile cotton/knit close-ups, calm everyday gestures, adult models in opaque neutral clothing, understated editorial color grade, no readable text or logos, no product-performance claims, no competitor references. Hold a clean final frame for branding added in post.”

### 2. Men's collection film

- **Filename:** `elan-men-collection-10s.mp4`
- **Duration / aspect:** 10 seconds; 16:9 master, 9:16 cutdown.
- **Website location:** `public/videos/elan-men-collection-10s.mp4`, Men's collection landing banner after review and approval.
- **Storyboard:** 0–2s: neutral wardrobe rail; 2–5s: close-up of an approved men's fabric and waistband detail; 5–8s: adult model in an opaque neutral layered outfit walking through soft window light; 8–10s: still product arrangement and clean end frame.
- **Generation prompt:** “Original premium men's everyday-apparel campaign, 10 seconds. Feature only the approved reference garments, accurately preserving shape, color, and construction. Adult model wearing opaque neutral layers, restrained movement, soft daylight, warm white and charcoal palette, tactile fabric close-ups, no logos/text/claims, no underwear exposure, no competitor imitation. Leave a clean end frame for 2427 ÉLAN post-production branding.”

### 3. Women's collection film

- **Filename:** `elan-women-collection-10s.mp4`
- **Duration / aspect:** 10 seconds; 16:9 master, 9:16 cutdown.
- **Website location:** `public/videos/elan-women-collection-10s.mp4`, Women's collection landing banner after review and approval.
- **Storyboard:** 0–2s: soft neutral fabric in natural light; 2–5s: macro detail of an approved women's garment's actual knit, strap, or seam; 5–8s: adult model in opaque neutral layers moving naturally in a bright interior; 8–10s: calm folded-product composition and clear end frame.
- **Generation prompt:** “Original premium women's everyday-apparel campaign, 10 seconds. Use only approved reference garments and preserve exact product construction and colors. Adult model in opaque neutral layering, tasteful non-suggestive framing, warm diffuse light, natural movement, soft ivory/sage/charcoal palette, fabric close-ups, no logos/text/claims, no competitor imitation. Leave a clean end frame for branding added in post.”

### 4. Fabric comfort close-up

- **Filename:** `elan-fabric-detail-8s.mp4`
- **Duration / aspect:** 8 seconds; 16:9 master, 9:16 cutdown.
- **Website location:** `public/videos/elan-fabric-detail-8s.mp4`, an approved fabric/craft editorial section after review.
- **Storyboard:** 0–2s: macro of an approved fabric under raking soft light; 2–4s: slow lateral movement across its actual texture; 4–6s: close-up of a real seam/edge from an approved garment; 6–8s: fabric rests on warm white with a simple end frame.
- **Generation prompt:** “Create an 8-second macro apparel-material film using the attached real 2427 garment/fabric as the exact reference. Slow, stable camera move, soft raking studio light, accurate color and knit texture, realistic fabric motion, no invented weave or construction, no performance claims, no text/logo/watermark. End on a warm-white neutral frame for post-production branding.”

## Integration checklist for generated assets

1. Confirm product-image accuracy against the corresponding approved catalog SKU and obtain commercial usage rights.
2. Keep original files and backups intact. Use new filenames until visual approval; do not overwrite current media.
3. Verify image dimensions, file size, color fidelity, and desktop/mobile crops.
4. Verify video codecs, muted playback, `playsInline`, poster, reduced-motion/static fallback, and loading behavior.
5. Test every final file at its intended public URL and verify the GitHub Pages base path before integrating it.
