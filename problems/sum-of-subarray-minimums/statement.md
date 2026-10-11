For every contiguous slice of `arr` (the slice must be non-empty and keep neighbours together), note its tiniest entry. Add those minima together and report the sum modulo `10^9 + 7`.

**Example 1:**
```
Input: arr = [3,1,2,4]
Output: 17
Explanation: The ten slices have minima 3, 1, 2, 4, 1, 1, 2, 1, 1, 1 which total 17.
```

**Example 2:**
```
Input: arr = [11,81,94,43,3]
Output: 444
Explanation: Longer slices are dominated by small values, giving 444 overall.
```

**Example 3:**
```
Input: arr = [1,2,3]
Output: 10
Explanation: Minima are 1, 2, 3, 1, 2, 1 for a total of 10.
```

**Constraints:**
- `1 <= arr.length <= 3 * 10^4`
- `1 <= arr[i] <= 3 * 10^4`
