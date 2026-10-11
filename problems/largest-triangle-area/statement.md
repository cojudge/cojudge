You are given a set of 2D points with integer coordinates. Pick any three distinct points as triangle corners and measure the triangle's area.

Return the largest achievable area.

Adaptation note: the original task returns a floating number. Here, return the area as a decimal string (for example `"2.0"` or `"0.5"`). The judge parses your string as a double and accepts it within an absolute tolerance of 1e-9 plus a relative tolerance of 1e-5.

**Example 1:**
```
Input: points = [[0,0],[0,1],[1,0],[0,2],[2,0]]
Output: "2.0"
Explanation: Corners (0,0), (0,2) and (2,0) enclose area 2, beating every other triple.
```

**Example 2:**
```
Input: points = [[1,0],[0,0],[0,1]]
Output: "0.5"
Explanation: Only one triple exists and its area is one half.
```

**Example 3:**
```
Input: points = [[0,0],[1,1],[2,2]]
Output: "0.0"
Explanation: The points are collinear, so no triangle has positive area.
```

**Constraints:**
- `3 <= points.length <= 50`
- `-50 <= points[i][j] <= 50`
- All points are distinct.
