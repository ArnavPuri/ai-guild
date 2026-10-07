---
name: triage-bug-report
description: Turns a raw bug report, error log or user complaint into a clear issue with reproduction steps, expected and actual behaviour, severity, likely area of the code and next questions. Use when someone shares a bug report or stack trace to triage.
license: CC-BY-4.0
metadata:
  number: "0023"
  title: Triage a Bug Report
  guild: builders
  master: ANYP Labs
  hallmark: ""
  tags: bugs, triage, issues
  languages: en
---

# Triage a Bug Report

Make a messy report actionable so the right person can pick it up in minutes.

## Ask first

Only if it blocks triage: the product or service affected, the version or environment, and whether it is happening now for many users.

## Steps

1. Restate the problem in one sentence a developer would write as an issue title.
2. Write **Steps to reproduce** from the report. Mark any step you had to guess with [ASSUMED].
3. Write **Expected** and **Actual** behaviour.
4. Read any stack trace or log: name the first frame in the product's own code, the error type and what it usually means. Do not guess beyond the evidence.
5. Rate severity: critical (data loss, security, everyone blocked), high (a core flow broken for some users), medium (workaround exists), low (cosmetic). Give one line of reasoning.
6. Suggest the likely area of the code and one or two hypotheses, each with a quick way to confirm or rule it out.
7. List the questions to send back to the reporter, at most three.

## Output

An issue ready to paste: Title, Summary, Steps to reproduce, Expected, Actual, Evidence, Severity, Hypotheses, Questions for reporter.

## Check before replying

- Personal data from the report (emails, names, account numbers) is removed or masked.
- Hypotheses are labelled as hypotheses.
- Severity follows the definitions above, not the reporter's tone.
