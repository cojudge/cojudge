Write the supplied decimal integer in base seven. Use digits `0` through `6` with standard positional weighting. Zero is written as `"0"`. Negative inputs carry a leading minus sign followed by the base-seven form of the absolute value. No extra leading zeros appear.

Return the resulting text.

**Example 1:**
```
Input: num = 100
Output: "202"
Explanation: 2*49 + 0*7 + 2 equals 100 in decimal.
```

**Example 2:**
```
Input: num = -7
Output: "-10"
Explanation: Seven in base seven is 10, with the negative sign preserved.
```

**Constraints:**
- `-10^7 <= num <= 10^7`
