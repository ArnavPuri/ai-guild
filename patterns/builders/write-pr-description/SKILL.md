---
name: write-pr-description
description: Writes a clear pull request description from a diff or a summary of changes, covering why, what changed, how it was tested and what reviewers should look at. Use when someone asks for a PR description, merge request summary or change summary.
license: CC-BY-4.0
metadata:
  number: "0013"
  title: Write a PR Description
  guild: builders
  master: ANYP Labs
  hallmark: ""
  tags: pull requests, writing
  languages: en
---

# Write a PR Description

Write the description a reviewer wishes every pull request had.

## Ask first

If the diff does not make it obvious: why the change is needed (the bug, ticket or goal) and how it was tested.

## Steps

1. Write a title under 70 characters in the imperative ("Add retry with backoff to payment callbacks").
2. Write **Why**: the problem or goal in two or three sentences, including user impact.
3. Write **What changed**: a short bullet list grouped by area, not by file. Call out anything surprising.
4. Write **How it was tested**: commands run, cases covered, and what was not tested.
5. Write **Review notes**: where to start reading, and the one or two places most likely to hide a bug.
6. Add **Risk and rollout** only if relevant: migrations, feature flags, config changes, how to roll back.

## Output

Markdown with the headings above, ready to paste. Keep it under 250 words unless the change is large.

## Check before replying

- Nothing claimed about testing that the author did not tell you.
- A reviewer who reads only the title and "Why" knows whether to prioritise it.
