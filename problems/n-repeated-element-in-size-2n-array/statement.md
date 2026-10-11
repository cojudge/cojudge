An integer array `nums` of even length `2 * N` contains `N + 1` distinct values, and exactly one of those values shows up `N` times (every other value appears just once). Find and return the value that is repeated.

**Example 1:**
```
Input: nums = [1,2,3,3]
Output: 3
Explanation: The value 3 fills half the slots while every other value appears once.
```

**Example 2:**
```
Input: nums = [2,1,2,5,3,2]
Output: 2
Explanation: Here 2 is the element occupying exactly half the array.
```

**Example 3:**
```
Input: nums = [5,1,5,2,5,3,5,4]
Output: 5
Explanation: Four of the eight entries are 5, so 5 is the repeated element.
```

**Constraints:**
- `2 <= nums.length <= 10^4` and the length is even.
- `0 <= nums[i] <= 10^3`.
- Exactly one value occurs `length / 2` times.
