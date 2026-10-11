You are given a time string `time` in 24-hour format `"HH:MM"`.

Using only the digits that already appear in `time` (each may be reused any number of times), form the next time strictly after `time` when read on a clock that wraps from `23:59` to `00:00`. The answer must itself be a valid time.

Return that next time as `"HH:MM"`.

**Constraints:**
- `time` matches `"HH:MM"` with `00 <= HH <= 23` and `00 <= MM <= 59`.
