There is a row of houses, and each house can be painted red, blue or green. Painting house `i` costs `costs[i][0]` for red, `costs[i][1]` for blue and `costs[i][2]` for green. No two neighboring houses may share the same color.

Return the smallest total cost to paint every house.

**Example 1:**
```
Input: costs = [[17,2,17],[16,16,5],[14,3,19]]
Output: 10
Explanation: Paint house 0 blue (2), house 1 green (5) and house 2 blue (3) for 2 + 5 + 3 = 10.
```

**Example 2:**
```
Input: costs = [[7,6,2]]
Output: 2
Explanation: With one house, pick the cheapest color, which costs 2.
```

**Example 3:**
```
Input: costs = [[1,5,3],[2,9,4]]
Output: 5
Explanation: Paint house 0 red (1) and house 1 green (4) for 1 + 4 = 5.
```

**Constraints:**
- `1 <= costs.length <= 100`
- `costs[i].length == 3`
- `1 <= costs[i][j] <= 1000`
