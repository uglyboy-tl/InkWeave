VAR visited_london = false
VAR visited_paris = false
VAR visited_rome = false
VAR score = 0

-> start

=== start ===
* {not visited_london} [Visit London]
    ~ visited_london = true
    You visit London.
    -> start
* {visited_london && not visited_paris} [Go to Paris]
    ~ visited_paris = true
    You travel to Paris.
    -> start
* {visited_london && visited_paris && not visited_rome} [Visit Rome]
    ~ visited_rome = true
    You reach Rome.
    -> start
* {visited_london && visited_paris && visited_rome} [All cities visited]
    You have completed the tour!
    -> END
* {score > 5} [High score option]
    Your score is high enough!
    -> END
* {score <= 5} [Low score option]
    Your score is too low.
    -> END