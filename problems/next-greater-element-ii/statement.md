Imagine the list wrapped into a circle so the element after the last position is the first position again. For each entry, look forward along this circular order for the first strictly larger value. If the full loop contains no larger value, record `-1` for that spot.

Return the list of answers aligned with the input order.

**Example 1:**
```
Input: nums = [1,2,1]
Output: [2,-1,2]
Explanation: The first 1 sees 2; 2 sees nothing larger in the circle; the last 1 wraps to 2.
```

**Example 2:**
```
Input: nums = [1,2,3,4,3]
Output: [2,3,4,-1,4]
Explanation: Each element except the maximum 4 finds a larger successor, with the final 3 wrapping to 4.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
