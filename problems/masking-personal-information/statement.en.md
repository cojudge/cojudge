You are given a string `s` that is either an email address or a phone number. Mask it as follows and return the result.

If `s` contains `@`, it is an email with a name part, an `@` sign, and a domain part:
- Convert the entire address to lowercase.
- Keep the first and last characters of the name part, replacing everything between them with exactly five `*` characters (the name always has at least two characters).

If `s` has no `@`, it is a phone number holding 10 to 13 digits mixed with separators such as spaces, `+`, `-`, `(`, and `)`:
- Keep only the last four digits; mask the first six significant digits as `***-***-`.
- When there are more than 10 digits, the leading extra digits form a country block: output `+`, then one `*` per extra digit, then `-`, followed by the masked local part. So 10 digits give `***-***-1234`, 11 digits give `+*-***-***-1234`, 12 digits give `+**-***-***-1234`, and 13 digits give `+***-***-***-1234`.

**Constraints:**
- `s` is a valid email or phone number as described above
- Emails contain exactly one `@`, a name of length at least 2, and a domain with at least one `.`
- Phone numbers contain 10 to 13 digits
