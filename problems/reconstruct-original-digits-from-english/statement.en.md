A shuffled bundle `s` holds the letters of several English digit names (`zero` through `nine`) rangled together with their letters out of order. Every letter in `s` belongs to exactly one of those hidden names, and the bundle is guaranteed to be splittable this way.

Recover the hidden digits and return them as a string with the digits arranged from smallest to largest.

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` uses only the letters appearing in English digit names.
- `s` is guaranteed to decompose into full digit names.
