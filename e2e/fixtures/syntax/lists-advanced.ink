LIST skills = strong, fast, smart

VAR heroSkills = strong

-> start

=== start ===
Skills: {heroSkills}
* [Add another skill]
    ~ heroSkills = fast
    Skills now: {heroSkills}
    -> start
* [Check skill count]
    ~ temp count = 1
    Has at least one skill.
    -> start