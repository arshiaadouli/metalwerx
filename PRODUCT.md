# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: locals with a load.** Homeowners, tradies (plumbers, electricians, air-con installers, mechanics, fabricators) and farmers in Melbourne's south-east with a car boot, ute or trailer of scrap metal. They arrive with practical questions: do you take this metal, how is it priced, how do I get paid, what do I need to bring, and when and where is the yard. Success is a phone call or a drive to the Hallam yard.

Secondary visitors, served by existing pages but not ranked first by the user: people selling an old or unwanted car; people with loads too big or heavy to bring in (farm machinery, tanks, dismantled sheds) who need a pickup; businesses that want bins on site and scheduled swaps.

## Product Purpose

Metal Werx Scrap Metal Recycling is a scrap metal yard in Hallam, VIC. It buys ferrous and non-ferrous metal (copper, brass, aluminium, stainless steel, lead and batteries, PVC wire, electric motors, alloy wheels, car parts, old machinery) and unwanted cars, and runs bin hire, pickup and collection, and commercial recycling. The website turns a local search into a call or a yard visit by answering, fast, the questions that stop people coming in.

## Positioning

Two facts the site may lead with, confirmed by the user:

1. **Every load is weighed and ticketed.** Metal is graded metal by metal, each grade weighed and paid at its own rate, with a weigh ticket.
2. **We come to you.** Bin hire, pickups and farm and site clean-ups across Melbourne's south-east, as well as drop-off at the yard.

Not confirmed, so never claimed: that the yard is independent, local-owned or family-run; years in business; free car removal (see Evidence on Hand); price superlatives beyond what the existing copy already says.

## Operating Context

- Victoria's Scrap Metal Dealers Act 2016: dealers can't pay cash. Sellers are paid by bank transfer (BSB and account number) once the load is weighed, and must show current photo ID, which the yard records. Existing copy still says "cash for cars" and "turn your scrap into cash" as figures of speech; payment itself is always bank transfer.
- Prices follow the metals market and change week to week. Clean, sorted metal earns a better grade. There is no published price list; the copy says to call for today's rates.
- Selling at the yard: bring it in, the yard sorts and weighs each grade, show ID, get paid.
- Service area for bins and pickups: Melbourne's south-east, from the Hallam yard.
- Yard address on the site today: 131 Wedgewood Rd, Hallam VIC 3803.

## Capabilities and Constraints

- Stack: Next.js 16 App Router with Cache Components (`"use cache"`, `ensureStatic = "navigation"`), React 19, Tailwind CSS 4, Radix-based shadcn/ui primitives, framer-motion 12, lucide-react. Deployed to the Vercel project `metawerx` with the CLI.
- Content sources: the home page copy, the blog page copy and the blog posts come from the Strapi 5 CMS (`../metalwerx-cms`) through `lib/pages.js` and `lib/blogs.js`. A redesign renders the existing content shapes and does not change the Strapi schema. Service copy lives in `app/services/services.js`, material copy in `app/what-we-buy/materials.js`, and the About, Contact and Privacy copy in their page files.
- Routes: `/`, `/about`, `/services` and its three service pages, `/what-we-buy` and its eleven material pages, `/blogs`, `/blogs/[slug]`, `/contact-us`, `/privacy-policy`, and the not-found pages. URLs and in-page anchors that other pages and Strapi content link to (`#ferrous`, `#non-ferrous`, `#hours`, `#location`, the service and material anchors, `#faq`) stay working.
- Light and dark themes with a visitor toggle (`data-theme` on `<html>`, remembered in localStorage, OS preference by default) are an existing feature.
- Photos from Strapi and the stock hosts are plain `<img>` elements (no `next/image` remote patterns).
- Not built yet: `/prices` and `/terms` (nothing links to them until they exist), a backend for the contact form (submissions are dropped), and the `#hours` and `#location` sections of the contact page.

## Brand Commitments

- Name: Metal Werx, in full Metal Werx Scrap Metal Recycling.
- Logo: `public/logo.png`, a one-colour white wordmark. "METAL WERX" is set in high-contrast serif capitals with a recycling symbol in place of the A, "SCRAP METAL RECYCLING" sits beneath in wide-tracked bold sans, over a rule. It is shown inverted to black on light grounds. Keep it as it is.
- Voice, from the existing copy: plain, practical Australian English (ute, tradies, nature strip, BSB), second person, short sentences, no hype.

## Evidence on Hand

- Real: the business name, the services, the materials and grades the yard buys, the payment and ID rules, FAQ answers (code comments ask the yard to confirm they match how it works), and six blog posts with cover photos in Strapi.
- Contact details, confirmed real by the user: phone 0470 131 025 (`tel:+61470131025`) and email info@metalwerx.com.au. The code comment in `app/contact-us/page.jsx` calling them placeholders is out of date. Opening hours exist but haven't been supplied, so any hours slot stays visibly marked for the yard to fill.
- Imagery: there are no photos of the actual yard, trucks or team. Every photo is free stock from Unsplash or Pexels, with its source noted in code. Never caption or frame a stock photo as the Metal Werx yard, staff or fleet.
- Absent, never to be invented: a price list, reviews or ratings, testimonials, customer logos, tonnage or years-in-business figures.
- Claim in existing copy that the user did not confirm: free car removal and towing (the Home Page's Cash for Cars section and FAQ in Strapi, the unwanted cars page in `materials.js`, and the pickup FAQ in `services.js`). Add no new instances, and leave the existing ones for the yard to confirm.

## Product Principles

1. Answer the yard questions first: what we take, how it's graded and weighed, how you're paid (bank transfer and photo ID), and when and where. Brand storytelling comes after.
2. One obvious next step: call, or come to the yard. A quote, pickup or bin booking is the second path.
3. Show the mechanism, not adjectives: grades, weighing, weigh tickets, bins and trucks, never invented proof.
4. Respect the visitor's time. Someone on a phone, standing next to a loaded ute, should get the answer in seconds.
