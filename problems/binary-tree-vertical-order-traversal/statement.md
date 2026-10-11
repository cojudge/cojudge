You are given the root of a binary tree. Picture each node sitting in a vertical column: the root starts at column `0`, a left child moves one column left, and a right child moves one column right.

Collect the node values column by column, ordering the columns from leftmost to rightmost. Inside a single column, list values from top to bottom; when several nodes share the same row and column, keep their left-to-right visiting order (as produced by a level-by-level scan that always visits a left child before its right sibling). Return the resulting list of columns.

**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[9],[3,15],[20],[7]]
Explanation: Column -1 holds 9; column 0 holds 3 then 15; column 1 holds 20; column 2 holds 7.
```

**Example 2:**
```
Input: root = [3,9,8,4,0,1,7]
Output: [[4],[9],[3,0,1],[8],[7]]
Explanation: Node 4 alone fills column -2, node 9 fills column -1, nodes 3, 0 and 1 share column 0 from top to bottom, node 8 fills column 1, and node 7 fills column 2.
```

**Example 3:**
```
Input: root = [3,9,8,4,0,1,7,null,null,null,2,5]
Output: [[4],[9,5],[3,0,1],[8,2],[7]]
Explanation: The deeper nodes 5 and 2 join columns -1 and 1 respectively, after the nodes above them.
```

**Constraints:**
- The tree holds between `0` and `100` nodes.
- `-100 <= Node.val <= 100`
