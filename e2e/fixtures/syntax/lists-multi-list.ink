LIST Characters = Alfred, Batman, Robin
LIST Props = champagne_glass, newspaper

VAR BallroomContents = (Alfred, Batman, newspaper)
VAR HallwayContents = (Robin, champagne_glass)

-> start

=== start ===
* [Describe Ballroom]
    {BallroomContents ? Alfred: Alfred is here. }
    {BallroomContents ? Batman: Batman is here. }
    {BallroomContents ? Robin: Robin is here. }
    {BallroomContents ? newspaper: A newspaper lies here. }
    {BallroomContents ? champagne_glass: A champagne glass lies here. }
    -> start
* [Describe Hallway]
    {HallwayContents ? Alfred: Alfred is here. }
    {HallwayContents ? Batman: Batman is here. }
    {HallwayContents ? Robin: Robin is here. }
    {HallwayContents ? newspaper: A newspaper lies here. }
    {HallwayContents ? champagne_glass: A champagne glass lies here. }
    -> start
* [Check Ballroom has Batman]
    {BallroomContents ? Batman:
        Batman is in the Ballroom.
    - else:
        Batman is not in the Ballroom.
    }
    -> start