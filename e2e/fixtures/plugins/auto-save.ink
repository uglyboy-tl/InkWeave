# linedelay:0

---
VAR count = 0
---

Start of the story.

-> loop

=== loop ===
= circle
You have clicked {count} times.

+ [Click me]
  ~ count += 1
  # autosave
  Clicked! Total: {count}.
  -> circle

* [Done]
  Story complete.
  -> END