---
name: review-pull-request
description: Reviews a diff or pull request for bugs, security and data risks, missing tests and unclear design, and returns prioritised, line-specific comments with suggested fixes. Use when asked to review code changes.
license: CC-BY-4.0
metadata:
  number: "0012"
  title: Review a Pull Request
  guild: builders
  master: ANYP Labs
  hallmark: ""
  tags: review, pull requests, testing
  languages: en
---

# Review a Pull Request

Give the author a short list of what must change, what should change, and what is optional, with fixes they can apply.

## Ask first

Only if it is not clear from what you were given: what the change is meant to do, and anything about where it runs (traffic, data size, who calls it).

## Steps

1. Summarise the change's intent in one or two sentences. If the code does not match the stated intent, that is the first comment.
2. Check correctness: edge cases (empty, null, very large, concurrent, repeated), error handling, off-by-one, time zones, and whether failures leave data half-written.
3. Check risk: input validation, permissions, injection, secrets committed in code, unbounded loops or queries, and changes to public interfaces or database schemas.
4. Check tests: is the new behaviour tested, including the failure path? Name the specific test that is missing.
5. Check clarity: names, function length, and comments that explain why rather than what.
6. Write each finding as: severity (must fix, should fix, nit), file and line, what goes wrong, suggested fix (code if short).
7. Finish with a one-line verdict: approve, approve with changes, or needs another round.

## Output

The intent summary, then findings grouped by severity, most important first, then the verdict. If there are no must-fix items, say so plainly.

## Check before replying

- Every must-fix comment describes a concrete failure, not a preference.
- No comment about formatting that a formatter or linter would handle.
- Suggested code fits the language and style of the diff.
