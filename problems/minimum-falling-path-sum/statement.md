You are given a square integer matrix. A falling path starts at any cell in the top row and moves down one row at a time, each step shifting to the column directly below, diagonally left-below, or diagonally right-below when those columns exist.

Return the smallest possible sum of a falling path from the top row to the bottom row.

**Example 1:**
```
Input: matrix = [[2,1,3],[6,5,4],[7,8,9]]
Output: 13
Explanation: The path 1 -> 4 -> 8 is minimal.
```

**Example 2:**
```
Input: matrix = [[-19,57],[-40,-5]]
Output: -59
Explanation: -19 plus -40 is the cheapest route.
```

**Example 3:**
```
Input: matrix = [[-48]]
Output: -48
```

**Constraints:**
- `1 <= matrix.length <= 100`
- The matrix is square with values between `-100` and `100`.
