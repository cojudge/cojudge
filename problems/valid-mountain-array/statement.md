Decide whether an array climbs strictly and then descends strictly, forming a single peak.

A valid mountain has at least three numbers. Reading left to right, values must rise by strict steps up to one summit, then fall by strict steps after it. The summit cannot sit at either end, and flat neighbours anywhere disqualify the array.

Given an integer array `arr`, return `true` when it is a mountain and `false` otherwise.

**Example 1:**
```
Input: arr = [2,1]
Output: false
Explanation: Two elements can never hold both a climb and a descent.
```

**Example 2:**
```
Input: arr = [3,5,5]
Output: false
Explanation: The repeated 5 breaks the strict increase.
```

**Example 3:**
```
Input: arr = [0,3,2,1]
Output: true
Explanation: It rises 0 < 3 and then falls 3 > 2 > 1 with the peak in the middle.
```

**Constraints:**
- `1 <= arr.length <= 10^4`
- `0 <= arr[i] <= 10^4`
