You are given a color string of the form `"#RRGGBB"`, where each pair is a two-digit hexadecimal value for the red, green, and blue channels. A shorthand color has the form `"#rgb"` and stands for `"#rrggbb"` where each digit is doubled (so `a` means `aa`).

Among all shorthand colors, return the one whose expanded form is closest to the input. Closeness is measured per channel by squared numeric difference, and channels are independent, so each channel can be optimized on its own. Return your answer as a seven-character lowercase string `"#rrggbb"` with each pair using identical digits.

**Constraints:**
- `color.length == 7`
- `color[0] == '#'`
- Remaining characters are hexadecimal digits `0-9`, `a-f`, or `A-F`
