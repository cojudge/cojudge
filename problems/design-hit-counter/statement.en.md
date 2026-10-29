A hit counter records hits at given timestamps (seconds) and answers how many
hits happened during the 5 minutes (300 seconds) ending now. A hit at time `t`
counts for a query at time `T` exactly when `T - 300 < t <= T`.

Hits and queries arrive in non-decreasing timestamp order.

**Adaptation note:** instead of a stateful class, implement
`runHitCounter(operations, timestamps)`, where each index holds one call:
`"hit"` records a hit at that timestamp, `"getHits"` queries it, and the
constructor entry `"HitCounter"` is ignored. The return collects one number
per `"getHits"` call, in order.

**Constraints:**
- `1 <= operations.length == timestamps.length <= 500`
- `0 <= timestamps[i] <= 10^9`, non-decreasing
- operations entries are `"HitCounter"`, `"hit"` or `"getHits"`
