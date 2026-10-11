You are given a time string `time` in 24-hour format `"HH:MM"`.

Using only the digits that already appear in `time` (each may be reused any number of times), form the next time strictly after `time` when read on a clock that wraps from `23:59` to `00:00`. The answer must itself be a valid time.

Return that next time as `"HH:MM"`.

**Example 1:**
```
Input: time = "19:34"
Output: "19:39"
```

**Example 2:**
```
Input: time = "23:59"
Output: "22:22"
```

**Example 3:**
```
Input: time = "00:00"
Output: "00:00"
```

**Constraints:**
- `time` matches `"HH:MM"` with `00 <= HH <= 23` and `00 <= MM <= 59`.
