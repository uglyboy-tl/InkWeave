-> game_start

=== game_start ===
Welcome to the counting game!
Current turn: {TURNS()}
* [Count to 1]
    You count: one.
    -> game_loop
* [Check turns since start]
    ~ temp since = TURNS_SINCE(-> game_start)
    Turns since start: {since}
    -> game_loop

=== game_loop ===
Turn: {TURNS()}
* [Count again]
    You count again.
    -> game_loop
* [Check turns since game_start]
    ~ temp since = TURNS_SINCE(-> game_start)
    Turns since game_start: {since}
    -> game_loop
* [End game]
    Game over!
    -> END