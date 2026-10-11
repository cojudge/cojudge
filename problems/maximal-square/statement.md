You are given a grid `matrix` of `'0'` and `'1'` characters. Find the largest square that consists entirely of `'1'`s and return its area (side length squared).

**Example 1:**
```
Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 4
Explanation: The 2x2 block of 1s in rows 1-2, columns 2-3 (0-based) is the biggest all-1 square, with area 4.
```

**Example 2:**
```
Input: matrix = [["0","1"],["1","0"]]
Output: 1
Explanation: No 2x2 all-1 square exists, but single 1s do, so the area is 1.
```

**Example 3:**
```
Input: matrix = [["0"]]
Output: 0
Explanation: There is no 1 at all.
```

**Constraints:**
- `1 <= matrix.length, matrix[0].length <= 300`
- `matrix[i][j]` is `'0'` or `'1'`.
