VAR gold = 0

-> start

=== start ===
You have {gold} gold coins.
* [Earn gold]
    ~ gold = gold + 10
    You earned 10 gold!
    -> start
* [End]
    Goodbye!
    -> END