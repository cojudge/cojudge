You are given the root of a binary tree.

Imagine numbering positions level by level as in a complete tree: the root is 1, and a node numbered `i` has children numbered `2*i` and `2*i+1`. Missing nodes still occupy numbers.

The width of a level is the distance between its leftmost and rightmost present nodes, inclusive of gaps: `last - first + 1`. Return the largest width over all levels.

**Constraints:**
- `1 <= number of nodes <= 3000`
- `-100 <= node value <= 100`
