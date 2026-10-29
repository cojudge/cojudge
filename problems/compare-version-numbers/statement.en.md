Version strings hold dot-separated revision numbers, such as `"1.2"` or `"1.10"`. Compare them from left to right as integers: leading zeros do not matter, and a missing revision counts as zero (so `"1.0"` equals `"1.0.0.0"`).

Return `1` when the first version is larger, `-1` when the second is larger, and `0` when they match.

**Constraints:**
- `1 <= version1.length, version2.length <= 200`
- Versions contain digits and dots, never start or end with a dot, and never hold empty revisions.
- Each revision fits in a 32-bit integer.
