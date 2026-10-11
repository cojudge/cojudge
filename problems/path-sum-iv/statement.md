You are given an array `nums` encoding a binary tree. Each entry is a three-digit number:

- hundreds digit: depth `d` (root is depth 1),
- tens digit: position `p` within that depth (counting from 1),
- ones digit: node value `v` (0..9).

The tree is consistent: every code except the root has its parent present, and positions follow heap rules where children of `(d, p)` are `(d+1, 2p-1)` and `(d+1, 2p)`.

Add up the sums of all root-to-leaf paths and return the total.

**Adaptation:** the encoded entries map to an int array in this judge.

**Example 1:**
```
Input: nums = [113,215,221]
Output: 12
Explanation: Leaves give paths 3+5 = 8 and 3+1 = 4; 8 + 4 = 12.
```

**Example 2:**
```
Input: nums = [113,221]
Output: 4
Explanation: Only path 3 -> 1 exists.
```

**Example 3:**
```
Input: nums = [111,222,333]
Output: 6
Explanation: The chain 1 -> 2 -> 3 totals 6.
```

**Constraints:**
- `1 <= nums.length <= 50`
- Each code is between 111 and 459 with value digit 0..9 and forms a valid tree.
