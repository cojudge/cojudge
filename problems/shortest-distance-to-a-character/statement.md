Given a string `s` and a target letter `c`, compute for every index the distance to the closest occurrence of `c` in `s`. The target is guaranteed to appear at least once.

Adaptation note: the original signature takes a `char`, which has no portable equivalent across all eight judges. Here `c` is a one-character string; implementations should read its first character.

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` and `c` consist of lowercase English letters.
- `c` has length 1 and occurs in `s`.
