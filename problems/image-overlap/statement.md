You are given two square binary matrices `img1` and `img2` of the same size. You may slide `img1` any number of cells up, down, left, or right (cells that move outside are discarded, and empty spots count as zero). After each shift, count the positions where both matrices show a `1`. Return the largest such overlap count over all possible shifts, including no shift.

**Example 1:**
```
Input: img1 = [[1,1,0],[0,1,0],[0,1,0]], img2 = [[0,0,0],[0,1,1],[0,0,1]]
Output: 3
Explanation: Shifting the first matrix one cell down and one cell right lines up three ones with the second matrix.
```

**Example 2:**
```
Input: img1 = [[1]], img2 = [[1]]
Output: 1
```

**Example 3:**
```
Input: img1 = [[0]], img2 = [[0]]
Output: 0
Explanation: Neither matrix contains a one, so every shift overlaps zero cells.
```

**Constraints:**
- `n == img1.length == img2.length`
- `n == img1[i].length == img2[i].length`
- `1 <= n <= 30`
- Entries are `0` or `1`
