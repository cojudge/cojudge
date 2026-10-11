You are given the root of a binary tree plus an integer `target`. Strip out every leaf whose value equals `target`.

Removal cascades: after deleting such a leaf, when its parent turns into a leaf that also stores `target`, that parent is stripped as well. Repeat this pruning until no matching leaf is left, then return the resulting root.

**Example 1:**
```
Input: root = [1,2,3,2,null,2,4], target = 2
Output: [1,null,3,null,4]
```

**Example 2:**
```
Input: root = [1,3,3,3,2], target = 3
Output: [1,3,null,null,2]
```

**Example 3:**
```
Input: root = [1,2,null,2,null,2], target = 2
Output: [1]
```

**Constraints:**
- The number of nodes in the tree is in the range `[1, 3000]`
- `1 <= Node.val, target <= 1000`
