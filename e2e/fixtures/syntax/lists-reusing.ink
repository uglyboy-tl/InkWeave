LIST heatedWaterStates = cold, boiling, recently_boiled
VAR kettleState = cold
VAR potState = cold

-> start

=== start ===
Kettle: {kettleState}, Pot: {potState}
* [Boil kettle]
    ~ kettleState = boiling
    Kettle is now boiling.
    -> start
* [Boil pot]
    ~ potState = boiling
    Pot is now boiling.
    -> start
* [Check both cold]
    {kettleState == cold:
        Kettle is cold.
    - else:
        Kettle is hot.
    }
    {potState == cold:
        Pot is cold.
    - else:
        Pot is hot.
    }
    -> start