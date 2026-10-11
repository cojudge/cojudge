An array `nums` may hold repeated values. Given a `target` that is guaranteed to occur in `nums`, return any index `i` with `nums[i] == target`.

*Interface note:* the original formulation is a class that stores `nums` in its constructor and answers many `pick(target)` queries with a uniformly random valid index. Because a judge cannot check randomness directly, this repo adapts the task to a single pure function `pick(nums, target)`. Any valid index is accepted: the checker only verifies `0 <= answer < nums.length` and `nums[answer] == target`, not the distribution. A solution that always returns the first match therefore passes here, while the genuine LeetCode version would additionally require each valid index to be equally likely.

**Example 1:**
```
Input: nums = [1,2,3,3,3], target = 3
Output: 2
Explanation: Valid answers are 2, 3 and 4; returning any one of them counts
as correct under this repo's checker.
```

**Example 2:**
```
Input: nums = [1,2,3,3,3], target = 1
Output: 0
Explanation: Only index 0 holds the value 1.
```

**Example 3:**
```
Input: nums = [5,5,5,5], target = 5
Output: 1
Explanation: Every index is valid; 1 is one acceptable choice.
```

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `target` occurs at least once in `nums`.
