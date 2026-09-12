# நிதி கண் (Nidhi Kaan)
## AI-Based Government Fund Utilization & Anti-Corruption Compliance System
### Tamil Nadu Edition — 2026

---

## Executive Summary

**Nidhi Kaan** ("நிதி கண்" — the Fund's Eye) is a Tamil-first, AI-powered verification and auto-escalation system for Tamil Nadu government schemes. Government schemes across Tamil Nadu — housing, roads, bus stands, and other public infrastructure — release funds based on periodic manual inspection, which is slow, hard to scale, and vulnerable to corruption. Nidhi Kaan replaces manual, discretion-based checks with geo-tagged photo verification, computer-vision progress tracking, GST bill cross-checks, and an automatic escalation chain reaching up to the CM's dashboard. The system is **scheme-agnostic** — built once, applicable to any fund-utilization scenario across departments and districts.

---

## 1. Problem Statement

Government schemes (housing grants, road maintenance contracts, bus stand/infrastructure works, etc.) release funds to beneficiaries or contractors based on periodic progress verification. Today, this verification is done through **manual inspection**, which is:

- Time-consuming and resource-heavy for government staff
- Vulnerable to corruption — inspectors can be bribed to approve fake or incomplete work
- Hard to scale across thousands of beneficiaries/contractors
- Difficult to audit after the fact (no verifiable evidence trail)

## 2. Core Idea

Build an **AI-powered verification and automatic escalation system** that replaces/augments manual inspection with geo-tagged photo evidence, computer vision verification, GST bill cross-checks, and a self-triggering escalation chain — removing human discretion (and therefore bribery opportunity) from routine compliance checks.

The system is designed to be **scheme-agnostic** — a reusable framework applicable to any fund-utilization scenario, not just one scheme — and **built Tamil-first** for the Tamil Nadu context.

## 3. Example Use Cases

### Use Case A — Housing Scheme (e.g., PMAY-style / Kalaignarin Kanavu Illam)
- Beneficiary receives funds in installments to build a house.
- Each month, beneficiary submits a **geo-tagged photo** proving construction progress matches the claimed stage/timeline.
- If no submission is made, the system auto-triggers a notice, then falls back to manual inspection.
- Government staff assigned for manual inspection must also submit their own geo-tagged photo as proof of visit.

### Use Case B — Road Repair / Infrastructure Contracts
- Contractor is assigned a repair task (e.g., pothole/road damage) with a deadline.
- Public can crowdsource complaints with geo-tagged photos.
- On completion, contractor submits geo-tagged "after" photo.
- AI compares "before vs after" to verify the damage is actually fixed at the correct location.

### Use Case C — Bus Stand / Public Infrastructure Construction
- Similar to housing: staged construction verified against claimed milestones and released fund tranches, applicable to Municipal Administration and Water Supply (MAWS) Dept-funded works like new bus stand construction.

## 4. Core AI Architecture (4 Core + 1 Optional)

The system is split into **four core independent AI subsystems** (plus an optional 5th predictive layer, Section 8), each solving a distinct problem, feeding a common Escalation Engine.

| # | AI System | Core Job |
|---|---|---|
| 1 | **Authenticity/Fraud Detection AI** | Verify submitted photo is genuine, correct location, not tampered |
| 2 | **Progress/Damage Understanding AI** | Understand actual work status from a verified photo |
| 3 | **Financial/Bill Verification AI** | Verify GST bills, detect billing fraud |
| 4 | **Notice & Escalation Management AI** | Auto-notify, track response, auto-escalate up the authority chain to CM |

### AI System 1 — Authenticity/Fraud Detection AI
**Job:** Confirm the submitted photo is genuine, taken at the correct location, and unedited — before anything else looks at it.

| Check | Purpose |
|---|---|
| Geotag/EXIF Verification | Confirms photo GPS coordinates match the assigned site location |
| Forced In-App Camera Capture | Blocks gallery uploads to prevent EXIF tampering; photo must be taken live within the app |
| Duplicate/Reused Image Detection | Perceptual hashing (pHash) to catch reused old photos submitted as new proof |
| Forgery Detection | Error Level Analysis (ELA) / CNN-based tampering detection |
| Timestamp Sanity Check | Cross-checks submission time against claimed work timeline |

Fails → submission auto-rejected, resubmission requested via Notice AI (System 4).

### AI System 2 — Progress/Damage Understanding AI
**Job:** Once a photo is confirmed genuine, understand what it actually shows.

| Check | Purpose |
|---|---|
| Construction Stage Classifier | CNN (e.g., ResNet/EfficientNet) trained to classify stage: foundation → walls → roof → finishing |
| Road Damage/Repair Classifier | Classifies road condition: damaged → repaired |
| Before/After Comparison | Compares current submission against prior submissions to validate real progress, not just a static photo |

Fails/insufficient progress → flagged as "no real progress" → routed to Notice AI (System 4).

### AI System 3 — Financial/Bill Verification AI (GST Cross-Check)
**Job:** Verify material procurement bills submitted by contractors to prevent inflated billing, fake invoices, and duplicate claims.

```
Contractor purchases material (cement, steel, etc.) with GST invoice
        |
        v
Invoice uploaded to system (GSTIN, invoice number, quantity, amount)
        |
        v
Cross-verify with GST Portal / IT filing records (GSTN API integration)
        |
        v
Checks:
   - Invoice is genuine (exists in seller's GSTR-1 vs contractor's GSTR-2A/2B)
   - Quantity purchased matches quantity claimed for this specific project
   - Amount claimed for reimbursement matches actual invoice value
   - Same invoice not reused across multiple projects (duplicate claim detection)
        |
        v
   Mismatch found (fake invoice / inflated quantity / invoice reused) -->
        Auto-flag --> Case registered against Contractor + Supplier Company
```

| Check | Purpose |
|---|---|
| GSTIN Validation | Confirms seller company's GSTIN is valid and active |
| Invoice Matching (GSTR-2B Reconciliation) | Confirms invoice was actually filed by the seller in GST returns (catches fake/unfiled invoices) |
| Quantity vs. Site Requirement | Cross-checks billed material quantity against AI-estimated material usage from System 2's progress output |
| Duplicate Invoice Reuse Detection | Detects same invoice claimed across multiple projects/contractors (hash-based match) |
| Shell Company / Anomaly Detection | Flags supplier companies with unusually high invoice frequency across many contractors |

Mismatch found → case registered against Contractor + Supplier Company; can auto-notify GST/Income Tax authorities since this may be tax fraud in addition to fund misuse.

### AI System 4 — Notice & Escalation Management AI
**Job:** Monitor deadlines, auto-generate notices, track responses, and auto-escalate through the authority chain — no human needs to manually push a case forward.

| Function | Detail |
|---|---|
| Deadline Monitoring | Tracks SLA timer for every pending case (submission deadline, staff inspection deadline, authority response deadline) |
| Auto-Notice Generation | On missed deadline → auto-sends notice (SMS/App/Email) to concerned party — no manual trigger needed |
| Response Tracking | Monitors if notice got a valid response (resubmission, action taken) within grace period |
| Auto-Escalation Logic | No response/action → automatically bumps case to next authority level |
| Escalation Chain Routing | Local Staff → District Authority → State Authority → **CM Dashboard** (final level) |
| Priority/Urgency Scoring | Cases stuck longest or repeat-offenders get higher priority flag on dashboard |

**Tech approach:** Mostly rule-based/decision-engine, not heavy ML — a workflow/state-machine engine for deadline + escalation logic, plus templated (Tamil-first) notice generation.

## 5. End-to-End Pipeline Flow

```
Submission (photo / bill) received
        |
        v
System 1 (Authenticity) --> gatekeeper, rejects fakes first
        |
        v
System 2 (Progress) --> only genuine photos analyzed for real progress
        |
System 3 (Financial) --> runs in parallel on billing/invoices
        |
        v
System 4 (Notice & Escalation) --> monitors all outcomes, sends notices,
                                     tracks response, auto-escalates:
        Local Staff -> District Authority -> State Authority -> CM Dashboard
        |
        v
Continuous non-compliance across levels --> fund recovery/refund process triggered
```

**Inspector accountability loop:** Systems 1 and 2 don't just verify the beneficiary/contractor — they also verify the *inspecting staff's* own submitted proof when manual inspection is triggered, closing the most common corruption loophole (staff falsely certifying work as done).

**Key mechanism:** Every level in System 4 has an SLA timer. If a level fails to act within its window, the case automatically escalates — no human can indefinitely sit on a case to protect a bribe arrangement.

## 6. Generalized System Architecture (Reusable Framework)

| Module | Function |
|---|---|
| Task/Complaint Intake | Accepts tasks across any scheme type — housing progress, road damage, bus stand construction, etc. |
| AI System 1 — Authenticity Engine | Common module — validates location + genuineness for any submission |
| AI System 2 — Progress/Damage Engine | Scheme-specific model — progress classifier per scheme type |
| AI System 3 — Financial Verification Engine | Common module — GST/invoice cross-check for any material-billing scheme |
| AI System 4 — Notice & Escalation Engine | Common module — tracks deadlines and auto-escalates across authority levels |
| Authority Dashboard | Role-based dashboard (Local Staff → District → State → CM) showing flagged cases, bottlenecks, and corruption heatmaps |

## 7. Localization — Tamil-First Design

| Where Tamil is needed | Detail |
|---|---|
| Mobile App (Beneficiary/Contractor side) | Full UI in Tamil (with English toggle) — submission forms, instructions, camera capture screen |
| Notice Generation (System 4) | Auto-generated notices in Tamil (SMS/App) — drafted natively in Tamil, not auto-translated |
| Authority Dashboard | Bilingual (Tamil + English) |
| Voice/Audio Support (optional) | Tamil text-to-speech for instructions/notices — helps field-level users who may not be fully literate |
| OCR/Invoice Reading (System 3) | OCR engine must support Tamil script recognition for bills with Tamil vendor names/text |

## 8. AI System 5 (Optional) — Predictive Risk Scoring

**Job:** Use historical data to proactively flag high-risk contractors/staff/districts *before* an issue occurs.

| Function | Detail |
|---|---|
| Historical Pattern Analysis | Learns from past behavior of contractors, staff, and districts (repeat delays, repeat mismatches, repeat escalations) |
| Risk Score per Entity | Every contractor/staff/district gets a dynamic risk score, updated as new cases resolve |
| Proactive Flagging | High-risk entities get closer monitoring even before a violation is confirmed |
| Feeds Into | Authority Dashboard — sorts/prioritizes cases by risk |

**Tech approach:** Classical ML (gradient boosting/logistic regression) on structured historical case data — lightweight, explainable model preferred since risk scores may justify official action.

## 9. Blockchain-Based Audit Trail (Optional, Strong for Pitch)

Every key event (photo submission hash, AI verification result, notice sent, escalation trigger, authority action) is logged to an **immutable ledger** (hash-chained log or permissioned blockchain), preventing any party — including insiders with database access — from silently altering records. Provides a verifiable audit trail for RTI requests, court cases, or CAG-style audits.

**Note:** A lightweight hash-chaining approach can deliver most of the trust benefit with far less engineering overhead than a full permissioned blockchain (e.g., Hyperledger); the latter can be a future enhancement.

## 10. Citizen Transparency Portal

Public dashboard: "How much fund released, what's the progress" for schemes in their locality — similar to RTI but real-time and self-service. Builds public trust and supports crowdsourced complaint submission (ties to Use Case B). Data shown should be aggregated/anonymized where needed.

## 11. Anonymous Whistleblower Reporting

In-app anonymous reporting channel for suspected bribery/collusion, routed directly to a higher authority level (bypassing the local level being reported on) to prevent retaliation. Identity protection enforced at the system/database level, not just UI level.

## 12. Offline-First Mobile App

Submissions captured and stored locally on-device when network is unavailable (common in rural Tamil Nadu sites), auto-syncing once connectivity returns, with hash-based integrity checks. Geo/time metadata captured at time of photo capture, not upload, to prevent manipulation during the offline window.

## 13. Security & Access Control

| Area | Approach |
|---|---|
| Access Control | Role-based access control (RBAC) — Local Staff / District / State / CM each see only what their role permits |
| Data Encryption | Encryption at rest (database, object storage) and in transit (TLS) |
| Sensitive Data Handling | GST/financial data and personal beneficiary data access-logged and restricted to authorized roles |
| Evidence Integrity | Submitted photos/invoices stored with hash values to detect any post-submission tampering |
| Whistleblower Data | Anonymous report identities isolated/encrypted separately from the main case database |

## 14. Tech Stack (Proposed)

- **Mobile App:** Flutter / React Native — geo-locked, in-app-only camera capture; Tamil + English UI; offline-first
- **Backend:** FastAPI / Node.js
- **AI/CV (Systems 1 & 2):** OpenCV, fine-tuned CNN (ResNet/EfficientNet), ELA for forgery detection, pHash for duplicate detection
- **Financial Verification (System 3):** GSTN API / third-party aggregators (ClearTax, Masters India), Tamil-trained OCR (Tesseract/Google Vision)
- **Escalation Engine (System 4):** Rule-based workflow/state-machine engine, templated Tamil notice generation
- **Database:** PostgreSQL + object storage (S3 or equivalent)
- **Dashboard:** React-based, bilingual, with map view for flagged locations and corruption heatmaps
- **Predictive Risk Scoring (System 5):** Classical ML (gradient boosting/logistic regression)
- **Audit Trail:** Hash-chained record logging or permissioned blockchain
- **Security:** RBAC, TLS + at-rest encryption, hash-based evidence integrity

## 15. Cost Estimate & Maintenance (Indicative)

**Reference point (TN Govt IT spending scale):** TNeGA's statewide paperless 'e-office' rollout cost about ₹13.44 crore. TN government IT projects typically go through ELCOT-empanelled vendors or TNeGA-approved system integrators via tender.

| Phase | Scope | Estimated Cost | Timeline |
|---|---|---|---|
| **Pilot/MVP** | 1 district, 1 scheme, Systems 1+2+4 | ₹40–70 lakh | 6–9 months |
| **Full System** | All 4–5 AI layers, GST integration, Tamil localization, security, audit trail | ₹2–4 crore | 12–18 months |
| **Statewide Rollout** | Cloud infra scaling, all districts, staff training | Additional ₹1–2 crore | Ongoing |

**Annual Maintenance (~15–20% of build cost/year):** Pilot ₹6–12 lakh/year; Full system ₹40–70 lakh/year.

**Key cost drivers often underestimated:** AI model training/retraining, GSTN API costs, cloud storage at scale, SMS/notification gateway costs.

**Recommended pitch approach:** MVP-first, phased rollout — low initial ask, scale as pilot proves impact.

## 16. Tirupur District — Suggested Pilot

Tirupur is a strong candidate for the first pilot:

- New **bus stand construction** already sanctioned (₹115.37 crore shared project across Tiruppur, Hosur, and other municipalities — GO Ms No.173) — a concrete, in-progress infrastructure case to pilot System 1+2+4 on.
- **₹100 crore** allocated to Tiruppur Municipal Corporation (2025-26) for urban development/roads — another applicable use case.
- Housing scheme allocations flow through the statewide "Kalaignarin Kanavu Illam" pool — Tirupur's house-count share would be the housing pilot's target.

**Recommended pilot scope:** Pick one funded, in-progress project (e.g., the Tirupur bus stand or a batch of road works) and run Systems 1+2+4 (Authenticity + Progress + Escalation) as a proof of concept before adding GST verification (System 3) and the optional layers.

## 17. Government Landscape & Adoption Pathway (2026)

Tamil Nadu is currently governed by the **TVK-led coalition**, with **C. Joseph Vijay** as Chief Minister (sworn in May 2026) and **N. Marie Wilson** as Finance Minister. Relevant outreach channels:

| Channel | Contact | Best for |
|---|---|---|
| CM's Petition Cell | cmcell@tn.gov.in | Formal proposal to CM's office |
| Finance Department Secretariat | finsec@tn.gov.in | Finance Ministry-side pitch |
| District Collectorate (Tirupur) | Via district website/office | District-level pilot approval |
| TNeGA / ELCOT | Via tnega.tn.gov.in | Digital governance technical evaluation |
| StartupTN / EDII-TN | www.editn.in, www.startuptn.in | Student/startup funding & incubation route |

**Recommended sequence for a student team:**
1. Build a working prototype (Systems 1+2+4 on one use case)
2. Enter **EDII-TN's Hackathon** (formerly "Tamil Nadu Student Innovators") for validation, mentorship, and prototype funding (~₹1 lakh/team historically)
3. Approach **Tirupur District Collector's office** for a small pilot on an existing funded project
4. Once validated, register as a startup and apply to **TANSEED** (StartupTN's seed fund, up to ₹15 lakh for Rural Impact category) for scale-up
5. Use pilot results as evidence when formally pitching to the Finance Department / CM's office for statewide adoption

## 18. Key Differentiator

**Nidhi Kaan** is not just a single-scheme app — it's a **plug-and-play, Tamil-first anti-corruption compliance framework** applicable to any Tamil Nadu government fund-utilization scheme. The system is self-policing across five layers: it verifies photo authenticity, understands actual progress, cross-checks financial bills against GST records, automatically escalates non-compliance through the authority chain, and proactively flags high-risk entities before violations occur — all backed by a tamper-proof audit trail, citizen transparency, and anonymous whistleblower protection.

The name itself communicates the product simply: **நிதி (Nidhi) = Fund, கண் (Kaan) = Eye** — "the eye that watches over public funds."

## 19. Open Items / Next Steps

- Decide pilot scheme to prototype first (Tirupur bus stand, roads, or housing)
- Source/collect training data for the progress/damage classifier (System 2)
- Design mobile app UI (geo-locked camera flow, Tamil-first, offline-capable)
- Define exact SLA durations per escalation level (System 4)
- Design fund-recovery/refund trigger logic for continuous non-compliance cases
- Explore GSTN API / third-party aggregator access for invoice verification (System 3)
- Define material-quantity-to-progress estimation logic (System 2 → System 3 linkage)
- Source/build Tamil-trained OCR and Tamil notice-generation templates
- Design historical dataset schema for predictive risk scoring (System 5)
- Decide audit trail approach: lightweight hash-chaining vs full permissioned blockchain
- Design citizen transparency portal data model (what's public vs restricted)
- Design anonymous whistleblower reporting flow and identity-isolation mechanism
- Confirm EDII-TN Hackathon 2026 registration window (check www.editn.in)
