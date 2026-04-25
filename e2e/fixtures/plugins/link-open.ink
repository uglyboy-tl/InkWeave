# linedelay:0

Welcome to the Link Open Plugin Test!

This test verifies link open functionality.

* [Open HTTPS Link]
  # linkopen: https:example.com
  You clicked the HTTPS link!
  -> END

* [Open HTTP Link]
  # linkopen: http:example.org
  You clicked the HTTP link!
  -> END

* [Open URL with Slash]
  # linkopen: https:example.com/path/to/page
  You clicked URL with slash!
  -> END

* [Open Relative Path]
  # linkopen: http:../core/basic.html
  You clicked relative path!
  -> END