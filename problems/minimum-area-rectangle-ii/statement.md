Given a set of distinct points on the integer grid, consider every rectangle (of any tilt, not just axis-aligned) whose four corners all belong to the set. Return the smallest such rectangle's area, or 0 when no four points form a rectangle.

Adaptation note: because all coordinates are integers, the area of any qualifying rectangle is always a whole number, so this task returns that exact integer area rather than a floating-point value.

**Example 1:**
```
Input: points = [[1,2],[2,1],[1,0],[0,1]]
Output: 2
Explanation: The four points are the corners of a tilted square whose area is 2.
```

**Example 2:**
```
Input: points = [[0,1],[2,1],[1,1],[1,0],[2,0]]
Output: 1
Explanation: Points (1,0), (1,1), (2,0) and (2,1) outline a unit square of area 1.
```

**Example 3:**
```
Input: points = [[0,3],[1,2],[3,1],[1,3],[2,1]]
Output: 0
Explanation: No four of these points form a rectangle, so the answer is 0.
```

**Constraints:**
- `1 <= points.length <= 50`
- All points are distinct.
- `0 <= points[i][0], points[i][1] <= 40000`
- The points arrive as a 2D integer array.
