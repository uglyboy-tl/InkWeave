LIST skills = strong, fast, smart

VAR heroSkills = strong

-> start

=== start ===
Skills: {heroSkills}
* [Add fast skill]
    ~ heroSkills = heroSkills + fast
    Now have: {heroSkills}
    -> start
* [Add smart skill]
    ~ heroSkills = heroSkills + smart
    Now have: {heroSkills}
    -> start
* [Check has strong]
    {heroSkills has strong:
        Hero is strong.
    - else:
        Hero is not strong.
    }
    -> start