A sorted list `arr` of distinct integers is given together with a goal `target`. Find the position of `target` inside `arr`, or return `-1` when it is absent.

This is a portable adaptation: the original setting hides the length behind a reader interface that returns a huge sentinel beyond its end (documented bound `10^4`, sentinel `2147483647`). Here the full sorted array is supplied directly and its length serves as the bound, so an ordinary binary search over the visible entries is the intended method.

**Constraints:**
- `1 <= arr.length <= 10^4`
- `-10^4 <= arr[i], target <= 10^4`
- Values in `arr` are strictly increasing.
- Out-of-bounds reads in the original would yield `2147483647`; here simply stay inside the array.
