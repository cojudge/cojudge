You are given a range `0` to `n - 1` with some values blocked in `blacklist`. Each call should return a uniformly chosen unblocked number.

Because random output cannot be compared directly, this task uses a deterministic stand-in: `calls` holds one integer per draw. For each entry, wrap it into the set of valid numbers and return the corresponding valid value (blocked entries below `sz` are remapped to free tail values, where `sz = n - blacklist.length`). The reference method builds that remapping once and answers every draw with a binary-free O(1) lookup.

Return one answer per entry of `calls`. The judge accepts any output whose entries are all inside `[0, n)` and avoid every blocked value, so any fair generator would pass; the wrapped-draw rule simply makes testing repeatable.

*Adaptation note:* the function is named `runBlacklist` and takes `(n, blacklist, calls)` so every supported type stays within the allowed set. Correctness is validity-only.

**Example 1:**
```
Input: n = 7, blacklist = [2,3,5], calls = [0,1,2,3]
Output: [0,1,6,4]
Explanation: Free numbers are 0, 1, 4 and 6. With tail remapping the draws land on 0, 1, 6 and 4.
```

**Example 2:**
```
Input: n = 4, blacklist = [2], calls = [0,1,2]
Output: [0,1,3]
Explanation: Free numbers are 0, 1 and 3; the last draw skips the blocked 2.
```

**Example 3:**
```
Input: n = 1, blacklist = [], calls = [5,-3]
Output: [0,0]
Explanation: Only 0 exists, so every draw answers 0.
```

**Constraints:**
- `1 <= n <= 10^9`
- `0 <= blacklist.length < n`
- All blocked values are distinct and inside `[0, n)`.
- `1 <= calls.length <= 1000`
