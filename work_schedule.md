# 🗓️ 5-Day Delivery Plan — Nutri-AI + CMS Backend
**Start:** 8:30 PM, May 5 → **Deadline:** May 10, End of Day  
**Stack:** Django + PostgreSQL (shared) | Nutri → React | CMS → Flutter

---

> [!IMPORTANT]
> You have **~4.5 effective working days** left. Both projects share a backend stack — write generic auth patterns once, reuse everywhere. Every hour counts, so the schedule below front-loads the hardest work when your brain is fresh.

---

## 🔍 Task Breakdown (from your notes)

### Nutri-AI (React Frontend)
| # | Task | Est. Time |
|---|------|-----------|
| 1 | Login / Signup — write + connect | 2.5 hrs |
| 2 | Onboarding Page API — write + connect | 2 hrs |
| 3 | Food Detection API — write + connect | 3 hrs |
| 4 | Store / Get Food Logs — write + connect | 2.5 hrs |
| 5 | NIA (AI) → Response API — write + connect | 3 hrs |
| 6 | ~~Report Gen. API~~ (crossed out — skip) | — |
| 7 | Analytics APIs | 2 hrs |
| **Total** | | **~15 hrs** |

### CMS (Flutter Frontend)
| # | Task | Est. Time |
|---|------|-----------|
| 1 | Login / Signup | 1.5 hrs (reuse Nutri auth) |
| 2 | Student Profile | 2 hrs |
| 3 | Meal Booking | 3 hrs |
| 4 | QR Generation | 2.5 hrs |
| 5 | Feedback | 1.5 hrs |
| 6 | Operator Login | 1.5 hrs |
| 7 | QR Scan | 2 hrs |
| **Total** | | **~14 hrs** |

**Grand Total: ~29 hours of work across 4.5 days = very doable at ~6-7 hrs/day of focused work.**

---

## 🧠 Strategy

1. **Auth is your bridge.** Nutri and CMS auth differ only in frontend — write the Django auth logic once cleanly (JWT + role-based), then wire up both frontends sequentially.
2. **Backend first, connect second.** For each task: write the Django view/serializer/URL → test in Postman → then wire the frontend. Don't mix both at the same time.
3. **CMS benefits from your Flutter groundwork.** You already debugged Flutter↔Django in past sessions. CMS login is basically done mentally.
4. **Do Nutri-AI first** — React is simpler to wire, and the AI/food detection work is the most complex (needs more headspace = do early).

---

## 📅 Day-by-Day Schedule

---

### 🌙 Tonight — May 5 (Now 8:30 PM → Sleep 1:30 AM)
**Goal: Clear mental state, knock out shared auth backend**

| Time | Task |
|------|------|
| 8:30 – 9:00 PM | Plan review, close distractions, set up workspace |
| 9:00 – 11:30 PM | **[Nutri] Login/Signup** — Django views, JWT, serializers, URLs. Test in Postman. |
| 11:30 PM – 1:00 AM | **[Nutri] Connect Login/Signup to React frontend** — verify token flow, error handling |
| 1:00 – 1:30 AM | Notes dump (what you did, what's next), wind down |
| **1:30 AM** | 🛏️ **SLEEP** |

---

### 🌅 May 6 — Wake 8:30 AM (7 hrs sleep)
**Goal: Complete Nutri-AI core features**

| Time | Task |
|------|------|
| 8:30 – 9:00 AM | Morning buffer (coffee, review yesterday's notes) |
| 9:00 – 11:00 AM | **[Nutri] Onboarding Page API** — write backend + connect React |
| 11:00 AM – 2:00 PM | **[Nutri] Food Detection API** — this is the complex one, take it slow |
| 2:00 – 3:00 PM | 🍽️ Lunch + full break (no screens) |
| 3:00 – 5:30 PM | **[Nutri] Store/Get Food Logs** — write Django model/view + connect React |
| 5:30 – 6:00 PM | Short walk/break |
| 6:00 – 8:00 PM | **[Nutri] NIA → Response API** — write Django AI call logic |
| 8:00 – 9:00 PM | Buffer / catch-up if behind |
| 9:00 – 10:30 PM | **[Nutri] Analytics APIs** (these are usually simpler aggregation queries) |
| 10:30 – 11:00 PM | Notes dump, Postman collection cleanup |
| **11:30 PM** | 🛏️ **SLEEP** |

> ✅ After today: **Nutri-AI backend should be ~90% done, React connected**

---

### 🌅 May 7 — Wake 7:30 AM (8 hrs sleep)
**Goal: Start CMS, reuse auth, finish big CMS features**

| Time | Task |
|------|------|
| 7:30 – 8:00 AM | Morning buffer |
| 8:00 – 9:30 AM | **[CMS] Login/Signup** — adapt Nutri auth for CMS roles (operator, student). Add role-based routing in Django. Connect Flutter. |
| 9:30 – 11:00 AM | **[CMS] Operator Login** — this is a role variant, fast to do after base auth |
| 11:00 AM – 1:00 PM | **[CMS] Student Profile** — model, serializer, view, Flutter connect |
| 1:00 – 2:00 PM | 🍽️ Lunch break |
| 2:00 – 5:00 PM | **[CMS] Meal Booking** — this needs careful model design (FK to student, operator, meal slot) |
| 5:00 – 5:30 PM | Break |
| 5:30 – 7:30 PM | **[CMS] QR Generation** — generate QR on booking, return to Flutter |
| 7:30 – 9:00 PM | **[CMS] QR Scan** — validate QR, mark attendance/booking |
| 9:00 – 10:00 PM | Notes, test everything end-to-end in Postman |
| **11:00 PM** | 🛏️ **SLEEP** |

> ✅ After today: **CMS backend ~80% done, Flutter connectivity tested**

---

### 🌅 May 8 — Wake 8:00 AM (9 hrs sleep — you've earned it)
**Goal: CMS Feedback, full integration testing, buffer day**

| Time | Task |
|------|------|
| 8:00 – 9:00 AM | Morning buffer |
| 9:00 – 10:30 AM | **[CMS] Feedback API** — write + Flutter connect |
| 10:30 AM – 12:30 PM | **[Nutri] Full Integration pass** — go through each endpoint, check React flow end-to-end, fix edge cases |
| 12:30 – 1:30 PM | 🍽️ Lunch |
| 1:30 – 4:00 PM | **[CMS] Full Integration pass** — Flutter end-to-end, check all role flows |
| 4:00 – 5:00 PM | Break |
| 5:00 – 8:00 PM | **Buffer / Overflow** — use this for anything that slipped, or error handling polish |
| 8:00 – 9:00 PM | Write brief README / API doc notes (good for interviews!) |
| **10:30 PM** | 🛏️ **SLEEP** |

---

### 🌅 May 9 — Wake 8:00 AM
**Goal: Polish, edge cases, final testing**

| Time | Task |
|------|------|
| 8:00 – 12:00 PM | Error handling, input validation, any missing serializers |
| 12:00 – 1:00 PM | Lunch |
| 1:00 – 4:00 PM | Final round of Postman tests on all endpoints |
| 4:00 – 6:00 PM | Fix anything broken from testing |
| 6:00 – 8:00 PM | Prep demo flows — can you walk through both apps start-to-finish? |
| **10:00 PM** | 🛏️ **SLEEP (EARLY — big day tomorrow)** |

---

### 🌅 May 10 — Wake 8:00 AM (DEADLINE DAY)
**Goal: Submission, no new features**

| Time | Task |
|------|------|
| 8:00 – 11:00 AM | Final bug fixes only — nothing new |
| 11:00 AM – 1:00 PM | Deploy / package / share credentials |
| 1:00 PM onward | **DONE. Rest.** |

---

## 😴 Sleep Schedule Summary

| Night | Bed | Wake | Hours |
|-------|-----|------|-------|
| May 5→6 | 1:30 AM | 8:30 AM | 7 hrs |
| May 6→7 | 11:30 PM | 7:30 AM | 8 hrs |
| May 7→8 | 11:00 PM | 8:00 AM | 9 hrs |
| May 8→9 | 10:30 PM | 8:00 AM | 9.5 hrs |
| May 9→10 | 10:00 PM | 8:00 AM | 10 hrs |

> [!TIP]
> Sleep is **not optional** — your Django code quality degrades sharply past midnight when you're stressed. 7+ hrs of sleep gives you faster, cleaner output during the day than grinding to 3AM.

---

## ⚡ Daily Productivity Rules (Minimal AI/Friends Dependency)

1. **Postman before frontend** — every endpoint must return 200 in Postman before you touch React/Flutter
2. **One feature at a time** — finish write + connect before moving to next item on your list
3. **15-min rule** — stuck on something for 15 min? Write what you tried, what the error is, then move on and come back. Don't spiral.
4. **No social media 9AM–6PM** — treat it like office hours
5. **Notes at end of each session** — 5-min brain dump. Tomorrow-you will thank you.

---

## 🎯 Interview Talking Points (Build these as you code)

As you build each feature, ask yourself:
- *Why did I design the model this way?*
- *What trade-offs did I make in this serializer?*
- *How does this JWT flow work end-to-end?*

These are exactly the questions interviewers ask. Building it yourself (with minimal AI) gives you the answers.

---

> [!NOTE]
> **You can do this.** 29 hours of work across 4.5 days at 6-7 hrs/day is very reasonable. The Django stack being shared between both projects is your biggest advantage — exploit it. Auth, permissions, and middleware you write for Nutri directly benefits CMS.
