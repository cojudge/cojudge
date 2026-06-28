import java.util.*;
class Marker {
    public List<String> solve(String[] strs) {
        Codec codec = new Codec();
        String encoded = codec.encode(strs);
        return codec.decode(encoded);
    }

    public boolean isCorrect(String[] strs, List<String> output) {
        List<String> expected = solve(strs);
        return expected.equals(output);
    }

    class Codec {
        public String encode(String[] strs) {
            StringBuilder sb = new StringBuilder();
            for (String s : strs) {
                sb.append(s.length()).append('#').append(s);
            }
            return sb.toString();
        }

        public List<String> decode(String s) {
            List<String> result = new ArrayList<>();
            int i = 0;
            while (i < s.length()) {
                int j = i;
                while (s.charAt(j) != '#') j++;
                int len = Integer.parseInt(s.substring(i, j));
                i = j + 1;
                result.add(s.substring(i, i + len));
                i += len;
            }
            return result;
        }
    }
}
