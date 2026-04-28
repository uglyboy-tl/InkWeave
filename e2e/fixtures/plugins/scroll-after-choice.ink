-> start

=== start ===
This is the beginning of a very long story that will test the scroll-after-choice plugin functionality.

The purpose of this test is to create enough content to fill the viewport and require scrolling.

{repeat_text()}

+ [First Choice - Long Content]
  -> first_choice
  
+ [Second Choice - Short Content] 
  -> second_choice

-> END

=== first_choice ===
You selected the first choice which generates a lot of content.

{repeat_text()}

This additional content should push the choices further down the page.

{repeat_text()}

Now you have more choices to select from, and the plugin should automatically scroll to make them visible.

+ [Continue with more content]
  -> more_content
  
+ [End the story]
  -> end_story

-> END

=== second_choice ===
You selected the second choice with shorter content.

But we still need enough content to test scrolling.

{repeat_text()}

+ [Go back to start]
  -> start

-> END

=== more_content ===
Even more content to ensure scrolling is needed.

{repeat_text()}

{repeat_text()}

This should definitely require scrolling to see the choices at the bottom.

+ [Final choice - end story]
  -> end_story

-> END

=== end_story ===
The story has ended. Thank you for testing the scroll-after-choice plugin!

-> END

=== function repeat_text() ===
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.
This is repeated text to create a long story.