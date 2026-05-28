my first deployment of cloudflare worker for a discord bot

references:
https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers 
https://developers.cloudflare.com/d1/get-started/ 


slash commands:
/test: Replies with hello world
/create
/list
/update
/delete
/weather (city) (state): replies with temperature, wind, forecast


to add slash commands, edit these:
commands.js (name and description)
index.js (what the command does)
register.js (to register the command)
rerun registration with $ DISCORD_TOKEN=**** DISCORD_APPLICATION_ID=**** node src/register.js
now redeploy: npx wrangler deploy


steps to recreate a cloudflare discord bot:
create project with wrangler
git init
update package.json for discord
npm install
make src files, .dev.vars, etc.
put secrets (this creates worker on cloudlfare dashboard)


changelog:
    d1 database, basic CRUD functionality
    files creates/changed:
        schema.sql, db.js
        updated commands.js, register.js, index.js

    weather.gov api
    files created/changed:
        weather.js
        updated commands.js, register.js, index.js

future todos:
    add subscription to daily weather notifications that will @ you on discord
        register zip code or city, state
        have CRUD (so be able to update my location)
    implement high/low daily temperature, chance of rain
    add images/symbols/emojis (like raincloud for rain)
    use case: have daily notifications in the morning without needing to remember to manually open weather app, later implement something like 'rain starts in 1 hour' or '30% chance of rain at 5pm'
    other possibility: add a feature that uses aws (currently uses cloudflare)