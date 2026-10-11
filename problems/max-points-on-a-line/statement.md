You are given points `points[i] = [xi, yi]` on the plane. All points are distinct.

A straight line can pass through any subset of them. Return the largest number of points that share one such line.

**Example 1:**
```
Input: points = [[1,1],[2,2],[3,3]]
Output: 3
Explanation: All three lie on the diagonal y = x.
```

**Example 2:**
```
Input: points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
Output: 4
Explanation: The line through [1,4], [2,3], [3,2], [4,1] holds four points, which is maximal.
```

**Constraints:**
- `1 <= points.length <= 300`
- `points[i].length == 2`
- `-10^4 <= xi, yi <= 10^4`
- All points are unique.
