Two non-negative numbers are stored as linked lists with the most significant digit first. Each node holds one digit, and there are no leading zeros except for the number zero itself.

Given the heads `l1` and `l2`, add the two numbers and return the sum in the same forward layout, again without leading zeros.

**Example 1:**
```
Input: l1 = [7,2,4,3], l2 = [5,6,4]
Output: [7,8,0,7]
Explanation: 7243 plus 564 equals 7807.
```

**Example 2:**
```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [8,0,7]
Explanation: 243 plus 564 equals 807.
```

**Example 3:**
```
Input: l1 = [0], l2 = [0]
Output: [0]
Explanation: Zero plus zero stays zero.
```

**Constraints:**
- Each list has `1` to `100` nodes.
- Each node value lies in `0..9`.
