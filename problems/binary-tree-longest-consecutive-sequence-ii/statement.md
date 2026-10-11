You are given the root of a binary tree. A consecutive trail is a sequence of nodes where each neighbouring pair differs by exactly one. The trail may climb upward and then descend (child-parent-child), and it may run either increasingly or decreasingly.

Find the number of nodes in the longest such trail anywhere in the tree. A lone node counts as length one.

**Example 1:**
```
Input: root = [1,2,3]
Output: 2
Explanation: Either 1-2 or 1-3 forms a consecutive pair.
```

**Example 2:**
```
Input: root = [2,1,3]
Output: 3
Explanation: The trail 1-2-3 passes through the root and is fully consecutive.
```

**Example 3:**
```
Input: root = [1]
Output: 1
```

**Constraints:**
- `1 <= number of nodes <= 3 * 10^4`
- `-3 * 10^4 <= Node.val <= 3 * 10^4`
