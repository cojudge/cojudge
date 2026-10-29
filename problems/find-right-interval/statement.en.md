You receive `intervals`, where each entry holds `[start, end]` and every start value is unique. For each position `i`, locate its right neighbor: the index `j` whose start is at least `intervals[i][1]` (the end of `i`) and as small as possible. An interval may be its own neighbor. When no start reaches far enough, record `-1` for that position.

Return the list of neighbor indices, one per input interval, in the original order.

**Constraints:**
- `1 <= intervals.length <= 2 * 10^4`
- Each inner pair has length 2 with `-10^6 <= start <= end <= 10^6`.
- Starts are pairwise distinct.
