Run:
/server
`docker-compose up -d`
`npm run dev`

/client
`npm run dev`

If another service listening on port:
`lsof -i :<port> -S`

Workflow

1. API round inc sent to server
2. server sends incRound event to clients
3. clients incround in scorepage
4. round inc hook sends results to server
5. server sends stats
