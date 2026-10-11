Measure the longest mountain-shaped run inside an array.

A mountain is a contiguous segment of length at least three that first climbs strictly upward to a single peak and then descends strictly downward, with no flat steps anywhere. Given `arr`, return the length of the longest such segment, or zero when none exists.

**Example 1:**
```
Input: arr = [2,1,4,7,3,2,5]
Output: 5
Explanation: The run [1,4,7,3,2] rises to 7 then falls, spanning five entries.
```

**Example 2:**
```
Input: arr = [2,2,2]
Output: 0
Explanation: Flat neighbours forbid any mountain.
```

**Example 3:**
```
Input: arr = [0,1,2,3,4,5,4,3,2,1,0]
Output: 11
Explanation: The whole array climbs to 5 and then descends.
```

**Constraints:**
- `0 <= arr.length <= 10^4`
- `0 <= arr[i] <= 10^4`
