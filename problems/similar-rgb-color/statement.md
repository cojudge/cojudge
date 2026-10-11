You are given a color string of the form `"#RRGGBB"`, where each pair is a two-digit hexadecimal value for the red, green, and blue channels. A shorthand color has the form `"#rgb"` and stands for `"#rrggbb"` where each digit is doubled (so `a` means `aa`).

Among all shorthand colors, return the one whose expanded form is closest to the input. Closeness is measured per channel by squared numeric difference, and channels are independent, so each channel can be optimized on its own. Return your answer as a seven-character lowercase string `"#rrggbb"` with each pair using identical digits.

**Example 1:**
```
Input: color = "#09f166"
Output: "#11ee66"
Explanation: Red 09 is nearest to 11, green f1 to ee, and blue 66 matches exactly.
```

**Example 2:**
```
Input: color = "#000000"
Output: "#000000"
Explanation: Black already uses shorthand digits.
```

**Example 3:**
```
Input: color = "#123456"
Output: "#113355"
Explanation: Each channel rounds to the closest doubled digit.
```

**Constraints:**
- `color.length == 7`
- `color[0] == '#'`
- Remaining characters are hexadecimal digits `0-9`, `a-f`, or `A-F`
