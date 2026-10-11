Remove as many stones as possible when each removal needs a row or column partner.

Stones sit on integer grid points with at most one stone per point. A stone may be taken away only while some other remaining stone shares its row or its column. Plan the removals to clear the maximum count.

Given `stones` where each entry is `[x, y]`, return the largest number of stones that can disappear.

**Example 1:**
```
Input: stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]
Output: 5
Explanation: All six stones link through shared rows and columns, so one connected group of six leaves five removable and one survivor.
```

**Example 2:**
```
Input: stones = [[0,0],[0,2],[1,1],[2,0],[2,2]]
Output: 3
Explanation: The corner stones form a linked group of four (three removable) while the centre stone stands alone.
```

**Example 3:**
```
Input: stones = [[0,0]]
Output: 0
Explanation: A lone stone has no partner, so nothing can be removed.
```

**Constraints:**
- `1 <= stones.length <= 1000`
- `0 <= xi, yi <= 10^4`
- No two stones share a coordinate.
