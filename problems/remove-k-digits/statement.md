A non-negative integer arrives as its decimal text `num` (no leading zeros unless the value itself is zero). Delete exactly `k` of its digits, keeping the relative order of the survivors, so that the remaining text denotes the smallest achievable value. Strip any leading zeros from the result; when every digit is deleted or only zeros remain, answer `"0"`.

**Example 1:**
```
Input: num = "1432219", k = 3
Output: "1219"
Explanation: Dropping '4', '3' and one '2' leaves "1219", the least value
reachable with three deletions.
```

**Example 2:**
```
Input: num = "10200", k = 1
Output: "200"
Explanation: Removing the leading '1' gives "0200", which normalizes to "200",
the smallest option.
```

**Example 3:**
```
Input: num = "10", k = 2
Output: "0"
Explanation: Deleting everything leaves nothing, reported as "0".
```

**Constraints:**
- `1 <= k <= num.length <= 10^5`
- `num` holds only digits and has no leading zeros except for `"0"` itself.
