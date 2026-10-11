You are given the root of a binary tree. Regard a node as **good** when its value reaches or exceeds every value encountered along the route from the root down to it.

Count how many such good nodes the tree holds. The route examined for each node contains both endpoints, the root and the node itself.

**Example 1:**
```
Input: root = [3,1,4,3,null,1,5]
Output: 4
```

**Example 2:**
```
Input: root = [3,3,null,4,2]
Output: 3
```

**Example 3:**
```
Input: root = [1]
Output: 1
```

**Constraints:**
- The number of nodes lies in the range `1` to `100000`.
- `-10^4 <= node.val <= 10^4`
