
-> start

=== start ===
# linedelay:0.05
This is the beginning of a story to test the fade effect plugin.

Line 1: This text should fade in gradually.
Line 2: Each line appears with a slight delay.
Line 3: The fade effect creates a smooth reading experience.
Line 4: Multiple lines help test the timing properly.
Line 5: We need enough content to verify the effect works.

+ [Continue with more fade effect content]
  -> more_content

+ [Test with custom line delay]
  -> custom_delay

+ [Test with no fade effect]
  -> no_fade

-> END

=== more_content ===
Additional content after making a choice.

Line A: This should also fade in properly.
Line B: Even after choices, the effect continues.
Line C: Multiple lines ensure comprehensive testing.
Line D: The fade effect should work consistently.
Line E: This validates the plugin functionality.

+ [Go back to start]
  -> start

-> END

=== custom_delay ===
# linedelay:0.1
Testing custom line delay of 100ms.

Custom Line 1: With longer delay between lines.
Custom Line 2: Each line takes more time to appear.
Custom Line 3: This tests parameter modification.
Custom Line 4: Different timing requires different waits.
Custom Line 5: Ensures flexibility of the plugin.

+ [Return to main menu]
  -> start

-> END

=== no_fade ===
# linedelay:0
Testing with no fade effect (instant display).

Instant Line 1: Should appear immediately.
Instant Line 2: No animation or delay.
Instant Line 3: All content visible at once.
Instant Line 4: Validates zero delay functionality.
Instant Line 5: Confirms proper handling of edge case.

+ [Back to start]
  -> start

-> END