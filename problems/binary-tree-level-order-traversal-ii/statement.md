List the values of a binary tree starting from the lowest level and ending at the root. Within each level keep left-to-right order.

For example, rows collected top-down as `[[3],[9,20],[15,7]]` should be returned as `[[15,7],[9,20],[3]]`.

**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[15,7],[9,20],[3]]
Explanation: Breadth-first rows are [[3],[9,20],[15,7]]; reading them backwards gives the answer.
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
- `-1000 <= Node.val <= 1000`

**Adaptation note:** The nested value list is represented as `int_list_2d` in this judge.
