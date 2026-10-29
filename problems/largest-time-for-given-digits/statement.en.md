Assemble the latest valid clock time from four digit tiles.

A 24-hour time looks like `"HH:MM"` with hours from `00` to `23` and minutes from `00` to `59`. You must use each of the four given digits exactly once. When several valid times exist, keep the latest one; when none exists, return the empty string.

Given `arr` of four digits, return the best time or `""`.

**Constraints:**
- `arr.length == 4`
- `0 <= arr[i] <= 9`
