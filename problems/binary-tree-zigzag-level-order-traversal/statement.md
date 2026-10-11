Walk a binary tree level by level, but alternate the reading direction on each row: the first row goes left to right, the next goes right to left, then left to right again, and so on.

Gather the node values at each depth in visit order, flip the rows that fall on odd depths, and return all rows from top to bottom.

**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[20,9],[15,7]]
Explanation: Row 0 is [3]. Row 1 would be [9,20] left-to-right, flipped to [20,9]. Row 2 stays [15,7].
```

**Example 2:**
```
Input: root = [1]
Output: [[1]]
```

**Example 3:**
```
Input: root = []
Output: []
```

**Constraints:**
- `0 <= number of nodes <= 2000`
- `-100 <= Node.val <= 100`

**Adaptation note:** The nested value list is represented as `int_list_2d` in this judge.
