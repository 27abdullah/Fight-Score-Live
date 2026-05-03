# Fight Score Live

Too often fights - boxing, MMA, kickboxing - end in controversial decisions where the judges are especially clueless and the fans are vehemently divided. Think Rodtang vs Superlek or Makhachev vs Volk 1. Fight Score Live is a platform to democratise judging and allows fans to vote for who they think won the fight round-by-round - with a winnder being voted in. 

## Trailer

[Video Demo](https://www.instagram.com/p/DM2R2i2t7Jd/)

## How it works
**As a Host**

1. Create a card for a live event you want to score
2. Add all the fights on the card
3. Start the card when the first fight begins and increment the rounds correspondingly

**As a scorer**
1. The card you want to score
2. Score each round on a 10 point must score system

## Features
1. Real-time scoring updates 
2. Accounts with authentication and authorisation
3. Live instant messaging 
4. Security-first backend

## Tech stack
* Socket.IO for real-time data updates, Redis to handle mass live read/writes and MongoDB for persistence.
* Utilises React, TailwindCSS for responsive frontend, JavaScript (Node.js, Express) backend, Docker and bash scripting for deployment. Supabase for authentication, authorisation and database triggers.
* Frontend hosted on netlify and backend on VM

