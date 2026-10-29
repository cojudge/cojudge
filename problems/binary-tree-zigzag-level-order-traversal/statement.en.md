Walk a binary tree level by level, but alternate the reading direction on each row: the first row goes left to right, the next goes right to left, then left to right again, and so on.

Gather the node values at each depth in visit order, flip the rows that fall on odd depths, and return all rows from top to bottom.

**Constraints:**
- `0 <= number of nodes <= 2000`
- `-100 <= Node.val <= 100`

**Adaptation note:** The nested value list is represented as `int_list_2d` in this judge.
