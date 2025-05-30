# Server start

## loadFromMongo

Redis and server: added via has with in progress from mongo

# Mod routes

## Create card

Once per card
-> Mod post @ /api/card
MongoDB: create card { state = IN_PROGRESS}
Redis: add current fight {state = IN_PROGRESS}
Server: add CardState to GameControlller map

## Inc round

Until returned {result : "fight over"}
-> Mod post @ /api/round
Server: tries to fetch id from memory, if not there checks redis
Socket emit: incRound
Socket emit: stats

Server: round += 1
Redis: round += 1
Redis: store fight stats

if round == max:
Card: state = FINISHED
MongoDB (persist):

-   updates stats for current fight
-   sets outcome: round, way="Decision"
    return Fight over

## finish

Server: state = FINISHED
Redis: updated with new state
MongoDB (persist):

-   updates stats for current fight
-   sets outcome: round=round, way=outcome
    return finished

## next fight

If next fight:
Server: updates for next fight, state = IN_PROGRESS
Redis:

-   deletes fight stats from previous round
-   updates current fight

## update

Socket emit: current card state + "clear" = true (removes session storage for rounds)

## end card

Mongo: sets state = FINISHED
Server: removes card from game controller map
Redis (clearFightStats + clearLiveState): delete fight stats of fight and delete current fight object
Socket emit: clear session
