#!/usr/bin/env python3
"""Refresh static navigation. No browser JavaScript or site build is required.

Run with --check to detect drift without writing. Only public HTML entrypoints
and the four known lesson directories are scanned.
"""
from pathlib import Path
import argparse
import re

ROOT = Path(__file__).resolve().parents[1]
LIBRARY = {"library.html", "examples.html", "translate.html", "port.html", "traps.html", "setup.html"}
WORKSHOP = {"index.html", "camp.html", "processing.html", *[f"session-{n}.html" for n in range(1, 6)]}


def page_paths():
    return sorted(ROOT.glob("*.html")) + sorted(p for n in range(1, 5) for p in (ROOT / f"unit{n}").glob("lesson-*.html"))


def header(path):
    name = path.name
    prefix = "" if path.parent == ROOT else "../"
    area = "Library" if name in LIBRARY else "Workshop" if name in WORKSHOP else "Course"

    def link(target, label, current=False, cls=""):
        attrs = f' class="{cls}"' if cls else ""
        if current:
            attrs += ' aria-current="page"' if target == name else ' aria-current="true"'
        return f'<a href="{prefix}{target}"{attrs}>{label}</a>'

    primary = "\n      ".join(link(target, label, label == area) for target, label in
                              [("index.html", "Workshop"), ("course.html", "Course"), ("library.html", "Library")])
    if area == "Workshop":
        secondary = [("index.html#sessions", "All sessions"), ("processing.html", "Get ready")]
        if name.startswith("session-"):
            secondary += [(name, f"Session {name[8]}"), (name + "#on-your-own", "On your own")]
        else:
            secondary += [("index.html#your-way", "On your own")]
    elif area == "Course":
        secondary = [("course.html", "Course home"), ("path.html", "Unit map"), ("calendar.html", "Pacing calendar"), ("frq.html", "Free response")]
    else:
        secondary = [("library.html", "All resources"), ("examples.html", "Compare"), ("translate.html", "Translate"), ("port.html", "Port a sketch"), ("traps.html", "Predict output"), ("setup.html", "Java setup")]
    context = "\n      ".join(link(target, label, target == name) for target, label in secondary)
    join = link("camp.html#interest", 'Join the interest list <span aria-hidden="true">↗</span>', name == "camp.html", "nav-join") if area == "Workshop" else ""
    join_line = "\n    " + join if join else ""
    return f'''<header class="masthead">
  <div class="wrap">
    <a class="logo" href="{prefix}index.html">Visible Java<span class="logo-sub">A CC Fest learning studio</span></a>
    <nav aria-label="Primary navigation">
      {primary}
    </nav>{join_line}
  </div>
</header>
<nav class="section-nav" aria-label="{area} navigation">
  <div class="wrap">
      {context}
  </div>
</nav>'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    changed = []
    for path in page_paths():
        old = path.read_text()
        new, count = re.subn(r'<header class="masthead">.*?</header>(?:\s*<nav class="section-nav".*?</nav>)?', lambda _: header(path), old, count=1, flags=re.S)
        if count != 1:
            raise SystemExit(f"Missing masthead: {path.relative_to(ROOT)}")
        if new != old:
            changed.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.write_text(new)
    print(f"{len(page_paths())} pages; {len(changed)} {'out of date' if args.check else 'updated'}.")
    if args.check and changed:
        print("\n".join(changed))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
