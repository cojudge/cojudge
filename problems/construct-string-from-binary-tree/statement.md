You are given the root of a binary tree. Build a compact text form of the tree by visiting nodes in root-first order (node, then left part, then right part).

Rules for each visited node with value `v`, left rendering `L` and right rendering `R`:

- When the node has no children, write just `v`.
- When only a left child exists, write `v(L)`.
- When both children exist, write `v(L)(R)`.
- When the left child is absent but the right child is present, write `v()(R)` so the empty left slot is still visible. A missing right child with no right content contributes nothing.

Apply the same rules recursively to every subtree and return the full string for the whole tree. An empty tree yields an empty string.

**Example 1:**
```
Input: root = [1,2,3,4]
Output: "1(2(4))(3)"
Explanation: Node 2 contributes "(4)" on its left; node 1 then wraps left "2(4)" and right "3".
```

**Example 2:**
```
Input: root = [1,2,3,null,4]
Output: "1(2()(4))(3)"
Explanation: Node 2 keeps an empty pair for its missing left child because its right child 4 exists.
```

**Example 3:**
```
Input: root = [1]
Output: "1"
```

**Constraints:**
- The tree holds between 0 and 10000 nodes.
- Each node value lies between -1000 and 1000.
