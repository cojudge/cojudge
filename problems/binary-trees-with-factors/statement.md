You are given distinct integers `arr`. A factored binary tree is a binary tree where every node value belongs to `arr`, and each non-leaf node's value equals the product of its two children.

Count all such trees (order of the two children matters, so swapping left and right creates a different tree). Return the count modulo 1,000,000,007.

**Example 1:**
```
Input: arr = [2,4]
Output: 3
Explanation: Singletons 2 and 4, plus root 4 with children 2 and 2.
```

**Example 2:**
```
Input: arr = [2,4,5,10]
Output: 7
Explanation: Four singletons, root-4 tree (2,2), and two root-10 trees (2,5) and (5,2).
```

**Example 3:**
```
Input: arr = [2,3]
Output: 2
Explanation: Only the two singletons qualify.
```

**Constraints:**
- `1 <= arr.length <= 1000`
- `2 <= arr[i] <= 10^9`
- All values are distinct.
