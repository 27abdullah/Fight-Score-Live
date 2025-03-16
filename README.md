Run:
`./run.sh start`

If another service listening on port:
`lsof -i :<port> -S`

api request to create card - card made in mongo: list of fights, id, owner

all live data stored in redis: id/stats...

-   new client should only need redis info

=== CHANGE IN APPROACH
redis and server only out of sync when server goes down
add delete to redis and removal from controller after fight is over
add sync to master routes -> sync redis and game controller

== TODO NEXT
Model card-fight life cycle and track persistance

====
add sugar -> knockout animation, sub animation, robbery calculator!

all socket stuff stored using one server: id/socketstuff

memory: logic, {card ids → card name}
redis: card id → current fight (scores, fighters), card state
mongo: card

Scorer:
Views live cards page, list of card names→ memory
Clicks card and goes to score page, id, current fight → redis
Push/pull stats → redis

Moderator:
Create card → mongo, redis, memory
incround → redis
next → mongo to update redis
update future fight →mongo
