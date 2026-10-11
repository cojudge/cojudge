Consider how positive integers look when written as decimal strings and compared alphabetically: `"10"` starts with `'1'`, so it comes before `"2"`, even though ten is numerically larger than two. This task asks for the numbers from `1` through `n` arranged by that string ordering rather than by size.

Write a function that takes `n` and returns every integer in the interval `[1, n]`, sorted by the lexicographic order of its decimal representation.

**Constraints:**
- `1 <= n <= 5 * 10^4`

Aim for a method that visits each value once and keeps only a constant amount of working memory besides the answer list.
