You start with `startFuel` units of fuel and must travel to a destination `target` units away along a straight road. Your car consumes one unit of fuel per unit of distance.

Along the way there are gas stations described by `stations`, where `stations[i] = [position, fuel]` means at distance `position` from the start you may stop once to gain `fuel` units. Each station can be used at most once, and you may skip stations.

Return the smallest number of stops needed to reach the destination. If the trip is impossible, return `-1`. Starting fuel counts as zero stops.

**Example 1:**
```
Input: target = 1, startFuel = 1, stations = []
Output: 0
Explanation: The destination is reached without stopping.
```

**Example 2:**
```
Input: target = 100, startFuel = 1, stations = [[10,100]]
Output: -1
Explanation: You run out before the only station.
```

**Example 3:**
```
Input: target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]
Output: 2
Explanation: Stop at the first station and one later station to arrive with the fewest refuels.
```

**Constraints:**
- `1 <= target, startFuel <= 10^9`
- `0 <= stations.length <= 500`
- `0 <= position <= target`
- `1 <= fuel <= 10^5`
- Positions are strictly increasing.
