You are given a range `0` to `n - 1` with some values blocked in `blacklist`. Each call should return a uniformly chosen unblocked number.

Because random output cannot be compared directly, this task uses a deterministic stand-in: `calls` holds one integer per draw. For each entry, wrap it into the set of valid numbers and return the corresponding valid value (blocked entries below `sz` are remapped to free tail values, where `sz = n - blacklist.length`). The reference method builds that remapping once and answers every draw with a binary-free O(1) lookup.

Return one answer per entry of `calls`. The judge accepts any output whose entries are all inside `[0, n)` and avoid every blocked value, so any fair generator would pass; the wrapped-draw rule simply makes testing repeatable.

*Adaptation note:* the function is named `runBlacklist` and takes `(n, blacklist, calls)` so every supported type stays within the allowed set. Correctness is validity-only.

**Constraints:**
- `1 <= n <= 10^9`
- `0 <= blacklist.length < n`
- All blocked values are distinct and inside `[0, n)`.
- `1 <= calls.length <= 1000`
