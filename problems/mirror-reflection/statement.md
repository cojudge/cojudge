A square room has side length `p`. Its corners hold light sensors numbered so that the starting corner (where the laser sits) has no sensor, one neighbor corner holds sensor 1, the opposite diagonal area relates to sensor 2, and the remaining corner holds sensor 0. A laser beam leaves the starting corner heading diagonally into the room.

Whenever the beam meets a wall it reflects like a mirror, keeping its progress toward the far side. It keeps bouncing until it lands exactly on one of the three sensor corners. The beam's first horizontal wall contact is determined by the integer `q`: think of the ray as advancing `q` units vertically for each `p` units of mirrored extension.

Given `p` and `q`, report which sensor (`0`, `1`, or `2`) the beam reaches first.

**Example 1:**
```
Input: p = 2, q = 1
Output: 2
Explanation: After one bounce the ray arrives at the corner for sensor 2.
```

**Example 2:**
```
Input: p = 3, q = 1
Output: 1
Explanation: The ray reaches the corner for sensor 1 without needing extension tricks.
```

**Example 3:**
```
Input: p = 3, q = 2
Output: 0
Explanation: The parity of the extended grid puts the first hit on sensor 0.
```

**Constraints:**
- `1 <= q <= 1000`
- `1 <= p <= 1000`
