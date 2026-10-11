Place the binary tree on a grid: the root sits at column 0 and row 0; a left child moves to column - 1 and row + 1, while a right child moves to column + 1 and row + 1.

Collect nodes column by column from left to right. Inside one column, order nodes by row from top to bottom; nodes sharing both column and row are ordered by value increasingly. Return the sequence of columns, each as a list of values in that order.

**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[9],[3,15],[20],[7]]
Explanation: Column -1 holds 9; column 0 holds 3 above 15; columns 1 and 2 hold 20 and 7.
```

**Example 2:**
```
Input: root = [1,2,3,4,5,6,7]
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation: Column 0 contains rows 0, 2, 2 with values 1, 5, 6 in value order for the tied row.
```

**Example 3:**
```
Input: root = [1,2,3,4,6,5,7]
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation: Exchanging 5 and 6 leaves the column report unchanged because the tied row is value-sorted.
```

**Constraints:**
- The tree holds 1 to 1000 nodes.
- Node values range from 0 to 1000.
