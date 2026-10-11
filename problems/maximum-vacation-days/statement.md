There are `n` cities and `k` weeks of vacation. `flights[i][j]` is 1 when a direct flight from city `i` to city `j` exists (staying put is always allowed, regardless of the diagonal). `days[i][w]` says how many vacation days you earn by spending week `w` in city `i`.

You begin week 0 in city 0: each Monday you may take any available flight (or stay), then collect that week's days in the city where you land. Plan the `k` weeks to maximize the total days collected.

**Constraints:**
- `n == flights.length == days.length`, `1 <= n <= 100`
- `k == days[0].length`, `1 <= k <= 100`
- `flights` entries are `0` or `1`; `0 <= days[i][w] <= 7`.
