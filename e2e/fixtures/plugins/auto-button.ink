Welcome to the Auto Button Plugin Test!

Choose a test scenario:

* [Basic Auto Sequence]
  -> basic_test

* [Skip Auto with Normal Choice]
  -> skip_test

* [Auto Loop with Counter]
  -> loop_test

== basic_test ==
This test verifies automatic button functionality.

* [This choice auto-clicks after 0.2 seconds#auto:0.2]
  You clicked the auto button!
  -> next_section

== next_section ==
* [Second auto choice after 0.15 seconds#auto:0.15]
  This is the second auto click!
  -> final_section

== final_section ==
The auto button test is complete.

* [Manual Choice]
  You manually clicked this choice.
  -> END

== skip_test ==
This tests if normal choice can skip auto sequence.

---
VAR skipped = false
---

* [Normal Choice - Skip Auto]
  ~ skipped = true
  You successfully skipped the auto sequence! Skipped: {skipped}
  -> END

* [Auto Choice#auto:0.5]
  ~ skipped = false
  Auto executed! Skipped: {skipped}
  -> END

---
VAR counter = 0
---
== loop_test ==
This tests auto loop with counter.
+ [Iteration {counter}#auto:0.2]
  ~ counter += 1
  Counter is now {counter}.
  {counter < 3:
    -> loop_test
  }
  Auto loop completed! Final counter: {counter}
  -> END