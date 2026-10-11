Decide whether an array climbs strictly and then descends strictly, forming a single peak.

A valid mountain has at least three numbers. Reading left to right, values must rise by strict steps up to one summit, then fall by strict steps after it. The summit cannot sit at either end, and flat neighbours anywhere disqualify the array.

Given an integer array `arr`, return `true` when it is a mountain and `false` otherwise.

**Constraints:**
- `1 <= arr.length <= 10^4`
- `0 <= arr[i] <= 10^4`
