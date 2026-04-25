LIST kettleState = cold, boiling, recently_boiled
~ kettleState = cold

-> start

=== start ===
* [Set kettle to cold]
    ~ kettleState = cold
    Kettle is now: {kettleState}
    -> start
* [Set kettle to boiling]
    ~ kettleState = boiling
    Kettle is now: {kettleState}
    -> start
* [Check if cold]
    {kettleState == cold:
        Kettle is cold.
    - else:
        Kettle is not cold.
    }
    -> start