A hit counter records hits at given timestamps (seconds) and answers how many
hits happened during the 5 minutes (300 seconds) ending now. A hit at time `t`
counts for a query at time `T` exactly when `T - 300 < t <= T`.

Hits and queries arrive in non-decreasing timestamp order.

**Adaptation note:** instead of a stateful class, implement
`runHitCounter(operations, timestamps)`, where each index holds one call:
`"hit"` records a hit at that timestamp, `"getHits"` queries it, and the
constructor entry `"HitCounter"` is ignored. The return collects one number
per `"getHits"` call, in order.

**Example 1:**
```
Input: operations = ["HitCounter","hit","hit","hit","getHits","hit","getHits","getHits"], timestamps = [0,1,2,3,4,300,300,301]
Output: [3,4,3]
Explanation: At time 4 the hits at 1, 2, 3 are all fresh. At time 300 there
are 4 hits (1, 2, 3, 300). At time 301 the hit at time 1 has expired, leaving
3 hits.
```

**Example 2:**
```
Input: operations = ["HitCounter","hit","getHits","getHits"], timestamps = [0,5,5,305]
Output: [1,0]
Explanation: The single hit counts at time 5 but has expired by time 305.
```

**Constraints:**
- `1 <= operations.length == timestamps.length <= 500`
- `0 <= timestamps[i] <= 10^9`, non-decreasing
- operations entries are `"HitCounter"`, `"hit"` or `"getHits"`
