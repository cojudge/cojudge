You are given distinct integers `arr`. A factored binary tree is a binary tree where every node value belongs to `arr`, and each non-leaf node's value equals the product of its two children.

Count all such trees (order of the two children matters, so swapping left and right creates a different tree). Return the count modulo 1,000,000,007.

**Constraints:**
- `1 <= arr.length <= 1000`
- `2 <= arr[i] <= 10^9`
- All values are distinct.
