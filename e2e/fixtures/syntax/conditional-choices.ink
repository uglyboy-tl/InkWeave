-> room

=== room ===
You are in a room.
* { not visited_chest } [Open the chest]
    You open the chest and find gold!
    -> visited_chest
* { visited_chest } [Take the gold again]
    You take more gold from the chest.
    -> room
* [Leave]
    You leave the room.
    -> END

=== visited_chest ===
The chest is now open.
* [Take gold]
    You take gold from the chest.
    -> room
* [Leave]
    You leave the room.
    -> END