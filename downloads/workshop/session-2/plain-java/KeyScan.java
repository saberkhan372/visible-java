// Session 2, optional studio bridge: the key log as a String.
// AP free-response Question 1 Part B always calls String methods, and sketches rarely do.
// Every String method here is on the Java Quick Reference. Predict each line before you run it.

public class KeyScan {

  /** Returns how many times target appears in keys. */
  public static int countKey(String keys, String target) {
    int count = 0;
    for (int i = 0; i < keys.length(); i++) {
      if (keys.substring(i, i + 1).equals(target)) {
        count++;
      }
    }
    return count;
  }

  /** Returns keys with every "." removed. */
  public static String pressedOnly(String keys) {
    String result = "";
    for (int i = 0; i < keys.length(); i++) {
      String key = keys.substring(i, i + 1);
      if (!key.equals(".")) {
        result = result + key;
      }
    }
    return result;
  }

  public static void main(String[] args) {
    String keys = "..p.p...";
    System.out.println(countKey(keys, "p"));
    System.out.println(keys.indexOf("p"));
    System.out.println(pressedOnly(keys));
    System.out.println(pressedOnly("...").length());
  }
}
