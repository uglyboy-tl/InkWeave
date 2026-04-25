LIST colours = red, green, blue
LIST moods = mad, happy, blue

VAR status = colours.blue
VAR mood = moods.blue

-> start

=== start ===
Colour: {status}, Mood: {mood}
* [Set colour to red]
    ~ status = colours.red
    Colour is now red.
    -> start
* [Set mood to happy]
    ~ mood = moods.happy
    Mood is now happy.
    -> start
* [Check colour is blue]
    {status == colours.blue:
        Colour is blue.
    - else:
        Colour is not blue.
    }
    -> start