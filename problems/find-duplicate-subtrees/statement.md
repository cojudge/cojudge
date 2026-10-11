You are given the root of a binary tree whose nodes hold integer values.

Two branches are considered the same shape when they have equal values placed in equal positions: either both are empty, or both roots share the value and their left sides match and their right sides match.

A shape is repeated when two or more distinct nodes start that same shape. Collect each repeated shape exactly once.

**Adaptation:** instead of handing back tree nodes, return each repeated shape as a preorder code. Write a node as its value, then its left code, then its right code, separated by commas; write `#` for a missing child. A leaf holding 4 therefore becomes `4,#,#`.

Return the codes in any order (the checker sorts them).

**Example 1:**
```
Input: root = [1,2,3,4,null,2,4,null,null,4]
Output: ["4,#,#","2,4,#,#,#"]
Explanation: The single leaf 4 appears three times and the branch rooted at 2 with a left leaf 4 appears twice.
```

**Example 2:**
```
Input: root = [2,1,1]
Output: ["1,#,#"]
Explanation: The two leaves match, giving one repeated code.
```

**Example 3:**
```
Input: root = [2,2,2,3,null,3,null]
Output: ["3,#,#","2,3,#,#,#"]
Explanation: Both the leaf and its parent branch repeat.
```

**Constraints:**
- `0 <= number of nodes <= 3000`
- `-200 <= node value <= 200`
