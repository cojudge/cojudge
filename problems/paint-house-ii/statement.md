There are `n` houses in a row and `k` colors numbered from `0` to `k - 1`. Painting house `i` with color `j` costs `costs[i][j]`. No two neighboring houses may share the same color.

Return the smallest total cost to paint every house. When there is one house, the answer is simply its cheapest color.

**Constraints:**
- `1 <= costs.length <= 100`
- `1 <= costs[i].length <= 100`
- `1 <= costs[i][j] <= 1000`
- Tests use at least two colors whenever there is more than one house.
