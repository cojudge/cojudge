Assemble the latest valid clock time from four digit tiles.

A 24-hour time looks like `"HH:MM"` with hours from `00` to `23` and minutes from `00` to `59`. You must use each of the four given digits exactly once. When several valid times exist, keep the latest one; when none exists, return the empty string.

Given `arr` of four digits, return the best time or `""`.

**Example 1:**
```
Input: arr = [1,2,3,4]
Output: "23:41"
Explanation: Candidates include 12:34, 21:43 and 23:41; the last of these is the latest.
```

**Example 2:**
```
Input: arr = [5,5,5,5]
Output: ""
Explanation: Every arrangement starts with 55, which is neither a valid hour nor a valid minute start.
```

**Example 3:**
```
Input: arr = [0,0,0,0]
Output: "00:00"
Explanation: Only midnight can be built, and it is valid.
```

**Constraints:**
- `arr.length == 4`
- `0 <= arr[i] <= 9`
