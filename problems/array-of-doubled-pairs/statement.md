Decide whether the array can be split into pairs where one entry doubles the other.

The array length is even. You must partition all entries into pairs `(a, b)` with `b = 2 * a`. Zeros pair with zeros, negatives follow the same doubling rule (for example `-2` pairs with `-4`), and every element is used exactly once.

Given `arr`, return `true` when such a pairing exists and `false` otherwise.

**Example 1:**
```
Input: arr = [3,1,3,6]
Output: false
Explanation: The 1 wants a 2 that is missing, so no full pairing works.
```

**Example 2:**
```
Input: arr = [2,1,2,6]
Output: false
Explanation: Only one 2 exists for the 1, leaving the 6 without a half.
```

**Example 3:**
```
Input: arr = [4,-2,2,-4]
Output: true
Explanation: Pair -2 with -4 and 2 with 4.
```

**Constraints:**
- `2 <= arr.length <= 3 * 10^4`
- Length is even.
- `-10^5 <= arr[i] <= 10^5`
