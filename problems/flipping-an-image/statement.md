You are given a binary matrix `image` where each cell is `0` or `1`. Transform it in two steps: first mirror every row horizontally (the leftmost cell swaps with the rightmost, and so on), then flip every bit (`0` becomes `1` and `1` becomes `0`). Return the resulting matrix.

**Example 1:**
```
Input: image = [[1,1,0],[1,0,1],[0,0,0]]
Output: [[1,0,0],[0,1,0],[1,1,1]]
Explanation: Mirroring gives [[0,1,1],[1,0,1],[0,0,0]], and flipping each bit gives [[1,0,0],[0,1,0],[1,1,1]].
```

**Example 2:**
```
Input: image = [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]
Output: [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]
```

**Constraints:**
- `1 <= image.length <= 20`
- `1 <= image[i].length <= 20`
- `image[i][j]` is `0` or `1`
