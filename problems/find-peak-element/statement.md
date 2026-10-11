A peak is an element that is strictly larger than its neighbours. The first and last elements each have a single neighbour to beat. Every non-empty array has at least one peak, and you may return the index of any of them.

Your answer is checked by position, not by exact index: any index whose element beats its neighbours is accepted.

**Example 1:**
```
Input: nums = [1,2,3,1]
Output: 2
Explanation: The value 3 at index 2 is larger than 2 and 1.
```

**Example 2:**
```
Input: nums = [1,2,1,3,5,6,4]
Output: 5
Explanation: Either index 1 (value 2 beats 1 and 1) or index 5 (value 6 beats 5 and 4) is accepted; one of them is 5.
```

**Example 3:**
```
Input: nums = [1]
Output: 0
Explanation: A lone element has no neighbours to beat.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- Adjacent elements differ (`nums[i] != nums[i+1]`).
