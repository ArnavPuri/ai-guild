---
name: write-release-notes
description: Writes release notes from a list of merged changes, commits or tickets, grouped for users (new, improved, fixed) with a separate technical section for developers. Use when preparing a release, changelog entry or update announcement.
license: CC-BY-4.0
metadata:
  number: "0024"
  title: Write Release Notes
  guild: builders
  master: ANYP Labs
  hallmark: ""
  tags: releases, changelog, writing
  languages: en
---

# Write Release Notes

Tell users what changed for them, in their words, and keep the technical detail for those who need it.

## Ask first

If missing: the version number and date, who reads these notes (end users, developers using an API, internal teams), and the list of changes.

## Steps

1. Drop changes users will never notice (refactors, dependency bumps, test changes) from the user section; keep them for the technical section.
2. Group what remains under **New**, **Improved** and **Fixed**.
3. Rewrite each item as a benefit in plain words, starting with a verb: "Export your reports as PDF" rather than "Added PDF export endpoint".
4. Put the most important change first, and give it one extra sentence if it changes how people work.
5. Write a **Breaking changes** section if anything requires users or developers to act, with exactly what to do.
6. Write the **Technical** section: short bullets with ticket or pull request references as given.

## Output

A heading with version and date, a one-sentence summary, then the sections above. Skip any section that would be empty.

## Check before replying

- Every user-facing line makes sense to someone who has never seen the code.
- Breaking changes are impossible to miss.
- No change is described that was not in the list.
