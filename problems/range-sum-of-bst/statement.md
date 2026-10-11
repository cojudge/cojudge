You are given the root of a binary search tree and two bounds `low` and `high`. Add up every node value that lies inside the inclusive interval `[low, high]`.

**Example 1:**
```
Input: root = [10,5,15,3,7,null,18], low = 7, high = 15
Output: 32
Explanation: Nodes 7, 10, and 15 sum to 32.
```

**Example 2:**
```
Input: root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10
Output: 23
Explanation: Nodes 6, 7, and 10 sum to 23.
```

**Example 3:**
```
Input: root = [5,3,8,1,4,7,9], low = 1, high = 9
Output: 37
Explanation: Every node falls inside.
```

**Constraints:**
- The tree holds `1` to `10000` nodes with values `1..100000` and respects BST order.
- `1 <= low <= high <= 100000`
