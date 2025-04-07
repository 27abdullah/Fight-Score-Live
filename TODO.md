# server

-   results page
-   moderator controls: edit current round state

-   change mongo to postgres
-   authentication w/ supabase, JWT
-   authorisation
-   moderator panel
-   consider recovery when server goes down

-   json/socket validation (zod for api validation)
-   security: e.g., sanitizers

## Code updates

1.  Await properly for performance: await everything but in parallel

```
const p1 = step1();
const p2 = step2();
const p3 = step3();

await Promise.all([p1, p2, p3]);
```

2. Move state checking from mod routes to card state (IN_PROGRESS vs SET_WINNER)

# client

-   Client state lifecycle
-   update name tag
-   fight outcome screen
-   Sugar on info card
-   Sugar on score page
-   Colour scheme
-   fight_id/fighterA/Score -> can score multiple fights at once and not lose past scores

-   images
-   green/red to winner
-   Sugar on fight outcome, you guessed better than x% (can lodge vote on winner),robbery calculator
-   add past fight stats

# ideas

-   number of live viewers in room
