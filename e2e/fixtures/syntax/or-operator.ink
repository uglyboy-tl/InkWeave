VAR has_key = false
VAR has_lockpick = false
VAR visited_city = false
VAR visited_town = false

-> start

=== start ===
* {has_key || has_lockpick} [Open the door]
    You open the door successfully!
    -> END
* [Get key]
    ~ has_key = true
    You pick up the key.
    -> start
* [Get lockpick]
    ~ has_lockpick = true
    You pick up the lockpick.
    -> start
* {visited_city || visited_town} [Report your travels]
    You have traveled somewhere!
    -> END
* [Visit city]
    ~ visited_city = true
    You visit the city.
    -> start
* [Visit town]
    ~ visited_town = true
    You visit the town.
    -> start