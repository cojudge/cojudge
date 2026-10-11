A counter receives calls over time. Each call `ping(t)` reports how many calls arrived in the inclusive window `[t - 3000, t]`, counting the current call.

Instead of building a class, implement a replay function: given the strictly increasing call times `pings`, return an array where entry `i` is the answer `ping(pings[i])` would have produced if the calls arrived in order.

**Constraints:**
- `1 <= pings.length <= 10000`
- `1 <= pings[i] <= 10^9`, strictly increasing.

Adaptation: the original design problem is replayed through `runRecentCalls` using `int_array` input and output.
