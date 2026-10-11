Return a rearrangement of the input array through one portable function.

This is a deterministic, function-style adaptation of the classic shuffle design: implement `shuffleArray(nums)`, which returns an array holding exactly the same multiset of values as `nums` but in a shuffled order. The classic task additionally requires every permutation to be equally likely (usually via Fisher-Yates) across repeated calls; this portable version calls the function once per test and accepts any permutation, so fairness across calls is not verified. Even returning the input unchanged is accepted as long as the multiset matches — aim for a uniform shuffle anyway.

**Example 1:**
```
Input: nums = [1,2,3]
Output: [2,1,3]
Explanation: Any rearrangement with the same values, such as [2,1,3], is accepted.
```

**Example 2:**
```
Input: nums = [5]
Output: [5]
Explanation: A single value has only one arrangement.
```

**Example 3:**
```
Input: nums = [1,2,3,4]
Output: [3,1,4,2]
Explanation: All four values appear exactly once in a new order.
```

**Constraints:**
- `1 <= nums.length <= 50`
- `-10^6 <= nums[i] <= 10^6`
- All values of `nums` are unique.
