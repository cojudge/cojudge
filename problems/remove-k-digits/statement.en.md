A non-negative integer arrives as its decimal text `num` (no leading zeros unless the value itself is zero). Delete exactly `k` of its digits, keeping the relative order of the survivors, so that the remaining text denotes the smallest achievable value. Strip any leading zeros from the result; when every digit is deleted or only zeros remain, answer `"0"`.

**Constraints:**
- `1 <= k <= num.length <= 10^5`
- `num` holds only digits and has no leading zeros except for `"0"` itself.
