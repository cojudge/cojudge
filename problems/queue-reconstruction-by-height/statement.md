A crowd is described by pairs `[h, k]`: person height `h` and the count `k` of people in front who are at least as tall as `h`. The given `people` array holds these pairs in no particular order, and exactly one line ordering satisfies every pair.

Rebuild that line: return the pairs from front to back so that each entry's `k` equals the number of earlier entries whose height is greater than or equal to its own.

**Constraints:**
- `1 <= people.length <= 2000`
- `0 <= h <= 10^6`
- `0 <= k < people.length`
- A valid reconstruction always exists.
