A calculator starts by showing `startValue`. It has only two buttons: doubling
the displayed number, and subtracting one from it. Each button press counts as
one operation.

Given `startValue` and `target`, return the smallest number of operations that
reaches exactly `target` from `startValue`.

**Example 1:**
```
Input: startValue = 2, target = 3
Output: 2
Explanation: Double to 4, then subtract once.
```

**Example 2:**
```
Input: startValue = 5, target = 8
Output: 2
Explanation: Subtract to 4, then double to 8.
```

**Example 3:**
```
Input: startValue = 3, target = 10
Output: 3
Explanation: Double to 6, subtract to 5, double to 10.
```

**Constraints:**
- `1 <= startValue, target <= 10^9`
