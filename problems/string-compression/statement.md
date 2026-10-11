You are given text `s` made of letters. Imagine squeezing each maximal block of equal letters: keep one copy of the letter, and if the block length is greater than one, write the block length right after it. For example `aaab` squeezes to `a3b`.

Return the length of the squeezed form. You do not need to build the squeezed text itself, only report how long it would be.

> **Adaptation note:** the classic task rewrites a character array in place and returns its new length. Here the input arrives as a `string` `s` and you return the squeezed length as an `int`, using the same counting rule. A block of length `1` adds `1`, a block of length `c > 1` adds `1 + digits(c)`.

**Constraints:**
- `1 <= s.length <= 2000`
- `s` contains only English letters.
