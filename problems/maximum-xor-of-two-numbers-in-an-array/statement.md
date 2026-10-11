You are given a list of non-negative integers called `nums`. Pick two positions `i` and `j` (they may be the same position) and look at the value `nums[i] XOR nums[j]`, where `XOR` is the bitwise exclusive-or operation.

Return the largest XOR value you can obtain from any such pair.

**Example 1:**
```
Input: nums = [3,10,5,25,2,8]
Output: 28
Explanation: 5 XOR 25 equals 28, and no pair reaches a larger value.
```

**Example 2:**
```
Input: nums = [14,70,53,83,49,91,36,80,92,51,66,70]
Output: 127
Explanation: Some pair in the list XORs to 127, which is the best achievable score.
```

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `0 <= nums[i] <= 2^31 - 1`
