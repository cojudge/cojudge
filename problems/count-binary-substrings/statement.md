A binary string uses only `0` and `1`. Count its non-empty pieces that contain equal numbers of zeros and ones, with all zeros bunched together and all ones bunched together (so each valid piece looks like some zeros followed by some ones, or vice versa, with matching run lengths). Pieces occurring at different positions count separately even when their text matches.

**Example 1:**
```
Input: s = "00110011"
Output: 6
Explanation: Six overlapping pieces qualify, such as "0011" and "01" at several spots.
```

**Example 2:**
```
Input: s = "10101"
Output: 4
Explanation: The four length-2 neighbours "10", "01", "10", "01" qualify.
```

**Example 3:**
```
Input: s = "000111"
Output: 3
Explanation: Runs of three zeros and three ones allow three matches.
```

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` contains only `0` and `1`.
