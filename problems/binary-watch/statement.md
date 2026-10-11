A novelty watch shows the time with ten tiny lamps: four lamps encode the hour (`0` to `11`) in binary and six lamps encode the minute (`0` to `59`) in binary, each lamp worth a power of two with the smallest values on the right. Exactly `turnedOn` lamps are lit. List every time the watch could be displaying.

Format each answer as `h:mm`: the hour has no leading zero, while the minute always uses two digits (for instance `"1:00"`, never `"01:00"` or `"10:2"`). The order of the returned list does not matter.

**Example 1:**
```
Input: turnedOn = 1
Output: ["0:01","0:02","0:04","0:08","0:16","0:32","1:00","2:00","4:00","8:00"]
Explanation: Lighting one lamp either sets one minute bit or one hour bit,
giving six minute-only times and four hour-only times.
```

**Example 2:**
```
Input: turnedOn = 9
Output: []
Explanation: The hour 11 uses at most 3 lamps and the minute 59 at most 5,
so at most 8 lamps can ever be lit; 9 has no reading.

**Example 3:**
```
Input: turnedOn = 0
Output: ["0:00"]
Explanation: With nothing lit the watch reads midnight-ish zero.
```

**Constraints:**
- `0 <= turnedOn <= 10`
