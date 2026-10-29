Return a rearrangement of the input array through one portable function.

This is a deterministic, function-style adaptation of the classic shuffle design: implement `shuffleArray(nums)`, which returns an array holding exactly the same multiset of values as `nums` but in a shuffled order. The classic task additionally requires every permutation to be equally likely (usually via Fisher-Yates) across repeated calls; this portable version calls the function once per test and accepts any permutation, so fairness across calls is not verified. Even returning the input unchanged is accepted as long as the multiset matches — aim for a uniform shuffle anyway.

**Constraints:**
- `1 <= nums.length <= 50`
- `-10^6 <= nums[i] <= 10^6`
- All values of `nums` are unique.
