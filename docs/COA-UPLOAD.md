# How a real lab COA gets onto the site

Today every lot and COA on the site is sample data. The site draws three sample lots per product (codes like `PS-BPC-2609A`: `PS-`, the product code, year and month, a letter). The sections below say how a real lab result replaces one of them now, and how it will work once the Supabase backend has lots.

## What you need from the lab

- Their PDF for the lot.
- From it: the lab's name, the report ID, the test date, the purity (%), and if you want them shown: identity, net content, endotoxin, water content, appearance.

## Today (no backend)

1. **Save the PDF** as `store/coa/<lot code>.pdf`, for example `store/coa/PS-BPC-2609A.pdf`. Create the `coa` folder if it isn't there. Everything in `store/` is published, so the file will be on the site at `coa/PS-BPC-2609A.pdf`.
2. **Open `store/js/data.js`** and find `PS.lotOverrides`. Add one line for the lot, using the lot code exactly as printed on the vial:

   ```js
   'PS-BPC-2609A': { lab: 'Example Analytical Labs', reportId: 'EAL-2609-0142', tested: '2026-09-02', purity: 99.4, pdf: 'coa/PS-BPC-2609A.pdf' },
   ```

   | Field | What it is |
   | --- | --- |
   | `lab`, `reportId` | The lab and its report number. Shown at the top of the COA page and the printable certificate. |
   | `tested` | Test date, as `'YYYY-MM-DD'`. |
   | `purity` | HPLC purity as a number (no % sign). |
   | `pdf` | Path of the lab's PDF. With it, "Open the lab's PDF" opens that file in a new tab instead of the site's own printable certificate. |
   | `identity`, `content`, `endotoxin`, `water`, `appearance` | Optional. Same shape as the sample values (`identity: { expected: '1419.5', observed: '1419.6' }`, `endotoxin: '0.14'`, and so on). Leave out what the lab didn't report. |

3. **Until all your lots are real**, every other lot still shows the placeholder `[Testing lab]` and `[Report ID]`. To change the placeholder for all of them at once, edit `PS.lab` in the same file.
4. **If it's a product's current lot**, also update that product's `purity` in `data.js`, so the shop cards and the product page match the COA.
5. **Commit and push to `main`.** The site republishes in about a minute. Check it at `#/coa/<lot code>`: the lab, the report ID and the date should be the lab's, and the "SAMPLE DATA" marks are gone for that lot.

Not covered yet:

- **Only the three sample lot codes per product can be replaced.** A real vial with any other code isn't on the site until lots can be added (the backend step below).
- **The purity chart is still drawn by the site** from the lot's purity. It is not the lab's trace. For a real lot, the lab's PDF is the document to trust. Decide whether to hide the chart on real lots or add the lab's chromatogram picture.

## Once the Supabase backend has lots

The backend branch (`claude/supabase-accounts-products-1648c7`) has `products` and `orders` tables only (`supabase/schema.sql`), and `store/js/backend.js` loads only the catalog. **There is no lots table and no file storage for PDFs yet**, so lots would still come from the sample generator. What's missing, for Claude Code to build:

- A `lots` table: lot code, product id, current yes/no, test date, purity, lab, report ID, the other results, and the PDF's file name. Anyone can read it; only the dashboard (or the service key) can write.
- A public Storage bucket named `coa` for the PDFs.
- A `loadLots()` in `backend.js`, like `loadCatalog()`, that fills the site's lots from that table, and a PDF link that points at the bucket.

Then adding a COA needs no code and no deploy:

1. In the Supabase dashboard, **Storage → coa → Upload** the lab's PDF, named by lot code (`PS-BPC-2609A.pdf`).
2. **Table Editor → lots → Insert row**: lot code, product, test date, purity, lab, report ID, and the PDF's file name. Tick "current" for the newest lot of that product, and untick the one before it.
3. Reload the site. The lot shows up on Lab Tests and at `#/coa/<lot code>`, any lot code works, and "Open the lab's PDF" serves the uploaded file.

Update the product's purity in the `products` table too (its `details.purity`), so the shop cards match the new current lot.
