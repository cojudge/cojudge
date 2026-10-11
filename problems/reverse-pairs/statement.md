Consider all index pairs `(i, j)` with `i < j` in an integer list. Call such a pair reversed when the earlier value is larger than twice the later value, that is `nums[i] > 2 * nums[j]`.

Count how many reversed pairs the list contains and return that total.

**Example 1:**
```
Input: nums = [1,3,2,3,1]
Output: 2
Explanation: Two index pairs satisfy the greater-than-twice rule.
```

**Example 2:**
```
Input: nums = [2,4,3,5,1]
Output: 3
Explanation: Three index pairs satisfy the rule.
```

**Constraints:**
- `1 <= nums.length <= 5 * 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- Use 64-bit arithmetic when doubling to avoid overflow
