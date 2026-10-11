A snippet is valid when it consists of exactly one outer element with matched tags, optional text, and optional CDATA blocks. Tag names hold 1 to 9 uppercase letters. An opening tag looks like `<NAME>`, its closer like `</NAME>`, and a CDATA block looks like `<![CDATA[anything]]>` where the inside is taken literally.

Rules in plain terms: the snippet must start with an opening tag and end with its matching closer, with nothing before or after. Inside, plain text may appear only within some open tag, `<` must begin a valid tag or a well-formed CDATA, nested tags must close in reverse order, and every CDATA must terminate.

**Constraints:**
- `1 <= code.length <= 500`
- Code uses printable ASCII plus `<`, `>`, `/`, `!`, `[`, `]`.
