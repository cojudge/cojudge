Each bus route is a list of stops it serves in order; you may board or alight at any stop on a route, and changing buses is allowed only at a shared stop. Given all `routes`, a starting stop `source` and a destination `target`, find the smallest number of buses you must ride to reach the destination.

If the start equals the destination, the answer is 0 without boarding. If the destination cannot be reached at all, return -1. Otherwise count each bus boarded, including the first and the last.

**Example 1:**
```
Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6
Output: 2
Explanation: Take the first bus from 1 to 7, then the second bus from 7 to 6.
```

**Example 2:**
```
Input: routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12
Output: -1
Explanation: The component holding 15 never meets the component holding 12.
```

**Example 3:**
```
Input: routes = [[1,2,3]], source = 1, target = 1
Output: 0
Explanation: Already at the destination.
```

**Constraints:**
- `1 <= routes.length <= 500`
- `1 <= routes[i].length <= 10^5`
- Total stops across routes is at most `10^5`.
- `0 <= routes[i][j] < 10^6`
- `0 <= source, target < 10^6`
