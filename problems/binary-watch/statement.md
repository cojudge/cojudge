A novelty watch shows the time with ten tiny lamps: four lamps encode the hour (`0` to `11`) in binary and six lamps encode the minute (`0` to `59`) in binary, each lamp worth a power of two with the smallest values on the right. Exactly `turnedOn` lamps are lit. List every time the watch could be displaying.

Format each answer as `h:mm`: the hour has no leading zero, while the minute always uses two digits (for instance `"1:00"`, never `"01:00"` or `"10:2"`). The order of the returned list does not matter.

**Constraints:**
- `0 <= turnedOn <= 10`
