// Visible lab 1, Java transfer: the sliding window with no tiles.
// Predict every line before you run it.

public class StringScan {

  /** Returns how many times target appears in word, counting overlaps. */
  public static int countMatches(String word, String target) {
    int count = 0;
    for (int start = 0; start <= word.length() - target.length(); start++) {
      String window = word.substring(start, start + target.length());
      if (window.equals(target)) {
        count++;
      }
    }
    return count;
  }

  public static void main(String[] args) {
    System.out.println("banana".indexOf("ana"));
    System.out.println(countMatches("banana", "ana"));
    System.out.println(countMatches("banana", "x"));
  }
}
