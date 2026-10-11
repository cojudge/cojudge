There are `n` different songs. A playlist is a list of exactly `goal` songs satisfying two rules: every one of the `n` songs appears at least once, and whenever a song repeats, at least `k` other songs sit between the two plays (positions of equal songs differ by more than `k`).

Return the number of valid playlists, modulo `10^9 + 7`.

**Example 1:**
```
Input: n = 3, goal = 3, k = 1
Output: 6
Explanation: All 6 orderings of the 3 songs qualify.
```

**Example 2:**
```
Input: n = 2, goal = 3, k = 0
Output: 6
Explanation: Any length-3 sequence using both songs qualifies.
```

**Example 3:**
```
Input: n = 2, goal = 3, k = 1
Output: 4
```

**Constraints:**
- `1 <= k < n <= goal <= 100`
