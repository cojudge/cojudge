There are `n` houses in a row and `k` colors numbered from `0` to `k - 1`. Painting house `i` with color `j` costs `costs[i][j]`. No two neighboring houses may share the same color.

Return the smallest total cost to paint every house. When there is one house, the answer is simply its cheapest color.

**Example 1:**
```
Input: costs = [[1,5,3],[2,9,4]]
Output: 5
Explanation: Paint house 0 with color 0 (1) and house 1 with color 2 (4) for 1 + 4 = 5.
```

**Example 2:**
```
Input: costs = [[1,3],[2,4]]
Output: 5
Explanation: Either 1 + 4 or 3 + 2 gives 5 while keeping neighbors different.
```

**Example 3:**
```
Input: costs = [[7,6,2]]
Output: 2
Explanation: With one house, pick the cheapest of its colors.
```

**Constraints:**
- `1 <= costs.length <= 100`
- `1 <= costs[i].length <= 100`
- `1 <= costs[i][j] <= 1000`
- Tests use at least two colors whenever there is more than one house.
