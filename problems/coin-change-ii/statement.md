An integer `amount` plus an array `coins` holding mutually different token face values are provided.
Every face value may be reused without bound.
Count how many unordered selections total exactly `amount`.
Permutations of an identical multiset merge into a single tally.
The tally is promised to remain representable by a signed 32-bit integer.

**Constraints:**
- `0 <= amount <= 5000`
- `1 <= coins.length <= 300`
- `1 <= coins[i] <= 5000`
- All values in `coins` are distinct.
