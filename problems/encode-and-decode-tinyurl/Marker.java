import java.util.*;
class Marker {
    static class Codec {
        private Map<String, String> longToShort = new HashMap<>();
        private Map<String, String> shortToLong = new HashMap<>();
        private int counter = 0;
        private static final String PREFIX = "http://tinyurl.com/";
        public String encode(String longUrl) {
            if (longToShort.containsKey(longUrl)) return PREFIX + longToShort.get(longUrl);
            String key = Integer.toString(counter++, 36);
            longToShort.put(longUrl, key);
            shortToLong.put(key, longUrl);
            return PREFIX + key;
        }
        public String decode(String shortUrl) {
            String key = shortUrl.substring(shortUrl.lastIndexOf('/') + 1);
            return shortToLong.getOrDefault(key, "");
        }
    }
    public List<String> solve(String[] urls) {
        Codec codec = new Codec();
        List<String> result = new ArrayList<>();
        for (String url : urls) {
            String shortA = codec.encode(url);
            String shortB = codec.encode(url);
            String decoded = codec.decode(shortA);
            result.add(shortA);
            result.add(shortB);
            result.add(decoded);
        }
        return result;
    }
    public boolean isCorrect(String[] urls, List<String> output) {
        if (output == null || output.size() != urls.length * 3) return false;
        String prefix = "http://tinyurl.com/";
        Map<String, String> longToShort = new HashMap<>();
        Set<String> seenShorts = new HashSet<>();
        for (int i = 0; i < urls.length; i++) {
            String shortA = output.get(3 * i);
            String shortB = output.get(3 * i + 1);
            String decoded = output.get(3 * i + 2);
            if (shortA == null || shortB == null || decoded == null) return false;
            if (!shortA.equals(shortB)) return false;
            if (!decoded.equals(urls[i])) return false;
            if (!shortA.startsWith(prefix) || shortA.length() <= prefix.length()) return false;
            if (shortA.equals(urls[i])) return false;
            String prev = longToShort.get(urls[i]);
            if (prev != null) {
                if (!prev.equals(shortA)) return false;
            } else {
                if (seenShorts.contains(shortA)) return false;
                seenShorts.add(shortA);
                longToShort.put(urls[i], shortA);
            }
        }
        return true;
    }
}
