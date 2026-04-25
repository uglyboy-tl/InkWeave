# COMBINED IMAGE TEST

This is a combined test for image plugin.

# image: nonexistent-first.jpg

You should not see an image above this text.

* [Go to valid image flow]
  -> valid_flow

== valid_flow ==
# image: assets/test-image.png

This is a test for complete image flow.

* [Load non-existent image]
  # image: nonexistent-image.jpg
  The image should not display, but content should continue.
  -> END

* [Replace with different image]
  # image: assets/test-image2.png
  The original image should be replaced with a different one.
  -> END

* [Clear the image]
  # clear
  The image should be cleared.
  ** [Show image again]
    # image: assets/test-image.png
    The image should appear again.
    -> END