Given a rectangular grid of numbers, list its entries in diagonal zigzag order. Start at the top-left corner heading up-and-right, then alternate between down-and-left and up-and-right each time a border is reached. When a border blocks the diagonal step, sidestep along the border to the next row or column and flip direction.

Continue until every cell has been emitted once, and return the resulting flat list.

**Example 1:**
```
Input: mat = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,4,7,5,3,6,8,9]
Explanation: Diagonals are visited as [1], [2,4], [7,5,3], [6,8], [9] with alternating directions.
```

**Example 2:**
```
Input: mat = [[1,2],[3,4]]
Output: [1,2,3,4]
Explanation: The two middle cells form one diagonal visited bottom-up after the start.
```

**Constraints:**
- `1 <= mat.length * mat[i].length <= 10^4`
- Each row has the same length
- `-10^5 <= mat[i][j] <= 10^5`
