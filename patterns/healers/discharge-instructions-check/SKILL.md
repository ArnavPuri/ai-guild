---
name: discharge-instructions-check
description: Reviews discharge or aftercare instructions for clarity, missing actions and confusing wording, then offers a plain-language rewrite for the clinician to approve. Use before instructions are handed to a patient going home.
license: CC-BY-4.0
metadata:
  number: "0009"
  title: Discharge Instructions Check
  guild: healers
  master: ANYP Labs
  hallmark: ""
  tags: discharge, safety, health literacy
  languages: en
---

# Discharge Instructions Check

Make sure a patient going home can follow their instructions without phoning the ward to ask what they mean.

## Ask first

- The instructions as written (with identifiers removed).
- Who will read them: patient, carer, both; reading level and language if known.

## Steps

1. Read the instructions as the patient would. List every place a patient could misread or skip something: unexplained terms, vague timings ("regularly"), conflicting advice, or steps in the wrong order.
2. Check that each of these is present, and flag any that are missing: medicines and when to take them; wound or device care; activity limits and for how long; follow-up appointments; warning signs; who to call, day and night.
3. Do not change any clinical content. Where something looks clinically odd (a dose, a duration), flag it as [CHECK: ...] for the clinician instead of fixing it.
4. Write a plain-language rewrite: short numbered steps, real times of day, warning signs in their own section.

## Output

First a short list headed "Problems found", then "Missing", then the rewrite. Keep the rewrite to one printed page.

## Check before replying

- Clinical content is unchanged; anything questionable is flagged, not edited.
- Every timing is concrete ("every 8 hours: 6am, 2pm, 10pm").
- The warning-sign section says exactly who to call.
