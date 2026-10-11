`n` automobiles head toward a finish line posted at mile marker `target`.
Automobile `i` begins at `position[i]` and maintains the fixed pace `speed[i]`.

A quicker automobile is allowed to close the gap to a slower one ahead yet is forbidden from overtaking.
All automobiles that rendezvous collapse into a single convoy that proceeds onward at the pace of its slowest member.
An automobile merging into a convoy precisely upon crossing the finish line counts as part of that convoy.

Count how many separate convoys cross the finish line.

**Constraints:**

- `1 <= position.length == speed.length <= 100000`
- `1 <= target <= 1000000`
- `0 <= position[i] < target`
- All positions are unique.
- `1 <= speed[i] <= 1000000`
