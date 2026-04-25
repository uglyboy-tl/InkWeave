-> start

=== start ===
* [Check CHOICE_COUNT]
    ~ temp count = CHOICE_COUNT()
    Choice count: {count}
    -> check_turns
-> DONE

=== check_turns ===
* [Check TURNS]
    ~ temp turns = TURNS()
    Turns taken: {turns}
    -> start
-> DONE