---
name: write-unit-tests
description: Writes focused unit tests for a function or module, covering normal cases, edge cases and failure paths, in the project's existing test framework and style. Use when asked to add tests, raise coverage or test a bug fix.
license: CC-BY-4.0
metadata:
  number: "0025"
  title: Write Unit Tests
  guild: builders
  master: ANYP Labs
  hallmark: ""
  tags: testing, quality
  languages: en
---

# Write Unit Tests

Write tests that catch real bugs and read like documentation of the behaviour.

## Ask first

If you cannot tell from the code: the language and test framework in use, and an existing test file to match its style.

## Steps

1. Read the code and list its behaviours in plain sentences: "returns 0 for an empty cart", "throws when the quantity is negative". Show this list first.
2. For each behaviour, pick the cases: one normal case, the boundaries (empty, zero, one, maximum, very long input), invalid input, and each error path.
3. If the code has a bug fix attached, write a test that fails without the fix.
4. Write one test per behaviour, named after the behaviour, using arrange, act, assert.
5. Fake only what crosses a boundary (network, clock, file system, randomness); do not mock the code under test.
6. Keep tests independent: no shared mutable state, no order dependence.

## Output

The behaviour list, then the test file in a single code block, then one line on how to run it with the project's existing test command.

## Check before replying

- Test names describe behaviour, not implementation.
- Every assertion checks something meaningful, not just that a value exists.
- The style matches the existing tests you were shown.
