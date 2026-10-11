You receive `intervals`, where each entry holds `[start, end]` and every start value is unique. For each position `i`, locate its right neighbor: the index `j` whose start is at least `intervals[i][1]` (the end of `i`) and as small as possible. An interval may be its own neighbor. When no start reaches far enough, record `-1` for that position.

Return the list of neighbor indices, one per input interval, in the original order.

**Example 1:**
```
Input: intervals = [[1,2]]
Output: [-1]
Explanation: Nothing starts at or after 2 except itself ending at 2? Its own start 1 is below 2, so no neighbor qualifies.
```

**Example 2:**
```
Input: intervals = [[3,4],[2,3],[1,2]]
Output: [-1,0,1]
Explanation: Interval 1 ends at 3 and the smallest start beyond it is 3 (index 0); interval 2 ends at 2 with best start 2 (index 1).
```

**Example 3:**
```
Input: intervals = [[1,4],[2,3],[3,4]]
Output: [-1,2,-1]
Explanation: Only the middle interval finds a qualifying start at 3.
```

**Constraints:**
- `1 <= intervals.length <= 2 * 10^4`
- Each inner pair has length 2 with `-10^6 <= start <= end <= 10^6`.
- Starts are pairwise distinct.
