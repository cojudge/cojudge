There are `n` cities and `k` weeks of vacation. `flights[i][j]` is 1 when a direct flight from city `i` to city `j` exists (staying put is always allowed, regardless of the diagonal). `days[i][w]` says how many vacation days you earn by spending week `w` in city `i`.

You begin week 0 in city 0: each Monday you may take any available flight (or stay), then collect that week's days in the city where you land. Plan the `k` weeks to maximize the total days collected.

**Example 1:**
```
Input: flights = [[0,1,1],[1,0,1],[1,1,0]], days = [[1,3,1],[6,0,3],[3,3,3]]
Output: 12
Explanation: Week 0 in city 1 (6), week 1 in city 0 (3), week 2 in city 2 (3).
```

**Example 2:**
```
Input: flights = [[0,0,0],[0,0,0],[0,0,0]], days = [[1,1,1],[7,7,7],[7,7,7]]
Output: 3
Explanation: No flights leave city 0, so all weeks stay there: 1 + 1 + 1.
```

**Example 3:**
```
Input: flights = [[0,1,1],[1,0,1],[1,1,0]], days = [[7,0,0],[0,7,0],[0,0,7]]
Output: 21
Explanation: Hop 0 -> 1 -> 2 across the weeks to collect 7 + 7 + 7.
```

**Constraints:**
- `n == flights.length == days.length`, `1 <= n <= 100`
- `k == days[0].length`, `1 <= k <= 100`
- `flights` entries are `0` or `1`; `0 <= days[i][w] <= 7`.
