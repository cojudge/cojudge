You are handed a list of integers `nums`. Determine whether it hides three positions `i < j < k` whose values climb strictly, i.e. `nums[i] < nums[j] < nums[k]`.

The three entries need not sit next to each other — only their order and values matter. Return `true` when such a triple exists and `false` otherwise.

**Example 1:**
```
Input: nums = [1,2,3,4,5]
Output: true
Explanation: Any three rising positions work, for instance the first three entries.
```

**Example 2:**
```
Input: nums = [5,4,3,2,1]
Output: false
Explanation: The values only descend, so no rising triple can be formed.
```

**Example 3:**
```
Input: nums = [2,1,5,0,4,6]
Output: true
Explanation: Positions holding 1, 4, and 6 (in that order) form a valid climb.
```

**Constraints:**
- `1 <= nums.length <= 5 * 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
