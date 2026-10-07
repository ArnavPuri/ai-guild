---
name: accessibility-review
description: Reviews a design, screen or web page for common accessibility problems (contrast, text size, touch targets, focus, labels, headings, colour-only meaning, motion) and gives prioritised fixes. Use when someone shares a design or page and asks if it is accessible.
license: CC-BY-4.0
metadata:
  number: "0029"
  title: Accessibility Review
  guild: makers
  master: ANYP Labs
  hallmark: ""
  tags: accessibility, inclusive design, review
  languages: en
---

# Accessibility Review

Find the problems that stop real people from using the design, and say how to fix them.

## Ask first

If missing: what the screen is for, whether it is web, iOS or Android, and whether you have a screenshot, a description or the markup.

## Steps

1. **Contrast:** body text needs at least 4.5:1 against its background, large text (24 px and up, or 19 px bold) and icons at least 3:1. Name each element that looks too faint.
2. **Size:** body text at least 16 px on the web; touch targets at least 44 by 44 points with space between them.
3. **Colour:** anything shown only by colour (errors in red, status dots) also needs text, an icon or a pattern.
4. **Structure:** one main heading, headings in order, form fields with visible labels (not placeholder text alone), and link text that makes sense on its own.
5. **Keyboard and focus** (web): every control reachable by Tab, a visible focus style, and a logical order.
6. **Images and icons:** meaningful images need a text alternative; icon-only buttons need a label.
7. **Motion and time:** no flashing, a way to pause moving content, and no time limits without a way to extend them.
8. Rank the problems: **Blocker** (some people cannot use it), **Serious** (hard to use), **Minor**.

## Output

Problems grouped by rank, each with where it is, who it affects and the fix. Then what already works well, in one or two lines.

## Check before replying

- Only problems you can see in what you were given; say what you could not check (for example, screen reader behaviour from a static image).
- Each fix is specific enough for a designer to act on.
