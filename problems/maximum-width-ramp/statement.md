A ramp is a pair of positions `i < j` with `nums[i] <= nums[j]`, and its width is the distance `j - i`. Find the greatest width among all ramps in the array, or return 0 when no ramp exists.

**Example 1:**
```
Input: nums = [6,0,8,2,1,5]
Output: 4
Explanation: Pairing index 1 (value 0) with index 5 (value 5) spans 4 positions, wider than any other valid pair.
```

**Example 2:**
```
Input: nums = [9,8,1,0,1,9,4,0,4,1]
Output: 7
Explanation: Index 2 (value 1) to index 9 (value 1) gives width 7, the best possible here.
```

**Example 3:**
```
Input: nums = [5,4,3,2,1]
Output: 0
Explanation: Strictly falling values admit no pair with i < j and nums[i] <= nums[j], so the width is 0.
```

**Constraints:**
- `1 <= nums.length <= 5 * 10^4`
- `0 <= nums[i] <= 5 * 10^4`
