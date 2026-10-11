You are given distinct points on a 2D plane. An axis-aligned rectangle uses four of the points as corners, with sides parallel to the axes.

Return the smallest area among all such rectangles, or `0` when none exists.

**Example 1:**
```
Input: points = [[1,1],[1,3],[3,1],[3,3],[2,2]]
Output: 4
Explanation: The outer four points form a 2 by 2 square.
```

**Example 2:**
```
Input: points = [[1,1],[1,3],[3,1],[3,3],[4,1],[4,3]]
Output: 2
Explanation: Columns 3 and 4 with rows 1 and 3 give area 2.
```

**Example 3:**
```
Input: points = [[1,1],[2,2],[3,3]]
Output: 0
Explanation: No four points align into a rectangle.
```

**Constraints:**
- `1 <= points.length <= 500`
- Coordinates satisfy `0 <= x, y <= 40000`, all points distinct.
