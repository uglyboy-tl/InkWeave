# linedelay:0

Welcome to the CD Button Plugin Test!

This test verifies cooldown button functionality.
---
VAR counter = 0
---

-> start
=== start
= circle
~counter +=1
Counter is now {counter}.
+ [Normal Choice]
  This is a normal choice that works immediately.
  -> END

+ [CD Button#cd:0.5]
  You clicked the cooldown button!
  ->circle