A hero poisons an enemy on each attack. An attack launched at second `t` keeps the enemy poisoned over the inclusive span from `t` through `t + duration - 1`. If a fresh attack lands while poison is still active, the clock restarts and the effect now lasts `duration` seconds beyond the new attack.

You are handed the non-decreasing attack moments in `timeSeries` and the fixed `duration`. Compute the total number of integer seconds during which the enemy suffers poison, merging all overlapping spans.

**Example 1:**
```
Input: timeSeries = [1,4], duration = 2
Output: 4
Explanation: Spans [1,2] and [4,5] are disjoint, giving 2 + 2 seconds.
```

**Example 2:**
```
Input: timeSeries = [1,2], duration = 2
Output: 3
Explanation: Spans [1,2] and [2,3] overlap at second 2, giving 3 distinct seconds.
```

**Constraints:**
- `1 <= timeSeries.length <= 10^4`
- `0 <= timeSeries[i], duration <= 10^7`
- Attack times appear in non-decreasing order
