Run:
`./run.sh start`

If another service listening on port:
`lsof -i :<port> -S`

api request to create card - card made in mongo: list of fights, id, owner

all live data stored in redis: id/stats...

-   new client should only need redis info

all socket stuff stored using one server: id/socketstuff
