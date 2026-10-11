You are given a list of clock readings, each written as a five-character string `"HH:MM"` in 24-hour format (for example `"05:30"` or `"23:59"`).

Think of the readings as points on a circular 24-hour dial with 1440 minutes. The gap between two readings is the smaller of the clockwise and counter-clockwise distances along the dial.

Return the smallest gap, in minutes, among every pair of readings. If two readings show the same moment, the answer is zero.

**Example 1:**
```
Input: timePoints = ["23:59","00:00"]
Output: 1
Explanation: The two moments are one minute apart across midnight.
```

**Example 2:**
```
Input: timePoints = ["00:00","23:59","00:00"]
Output: 0
Explanation: Two entries coincide, so the closest gap is zero.
```

**Example 3:**
```
Input: timePoints = ["12:30","15:45","12:35"]
Output: 5
Explanation: The closest pair is 12:30 and 12:35.
```

**Constraints:**
- `2 <= timePoints.length <= 2 * 10^4`
- Each entry matches `"HH:MM"` with `00 <= HH <= 23` and `00 <= MM <= 59`

Adaptation note: the original signature takes a list of strings; here it is modelled as `String[] timePoints` (`string_array`) with identical semantics.
