You are given the root of a binary tree.

Imagine numbering positions level by level as in a complete tree: the root is 1, and a node numbered `i` has children numbered `2*i` and `2*i+1`. Missing nodes still occupy numbers.

The width of a level is the distance between its leftmost and rightmost present nodes, inclusive of gaps: `last - first + 1`. Return the largest width over all levels.

**Example 1:**
```
Input: root = [1,3,2,5,3,null,9]
Output: 4
Explanation: The second level covers four slots.
```

**Example 2:**
```
Input: root = [1,3,2,5,null,null,9,6,null,7]
Output: 7
Explanation: The bottom level stretches over seven positions.
```

**Example 3:**
```
Input: root = [1,3,2,5]
Output: 2
Explanation: Every level holds at most two neighbours.
```

**Constraints:**
- `1 <= number of nodes <= 3000`
- `-100 <= node value <= 100`
