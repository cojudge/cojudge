Each node of the given binary tree holds an integer, has either zero or two children, and every child value is at least as large as its parent value.

Find the second smallest distinct value appearing in the tree. If all nodes share the same value, return `-1`.

**Example 1:**
```
Input: root = [2,2,5,null,null,5,7]
Output: 5
Explanation: Minimum is 2; the next larger distinct value is 5.
```

**Example 2:**
```
Input: root = [2,2,2]
Output: -1
Explanation: No second distinct value exists.
```

**Example 3:**
```
Input: root = [5,8,5]
Output: 8
```

**Constraints:**
- The tree has between 1 and 25 nodes.
- All values lie in `[1, 2^31 - 1]`.
- Each interior node has exactly two children.
