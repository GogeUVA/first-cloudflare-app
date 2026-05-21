my first deployment of cloudflare worker for a discord bot

references:
https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers 
https://developers.cloudflare.com/d1/get-started/ 


slash commands:
/test: Replies with hello world


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


May 21 changelog:
    d1 database, basic CRUD functionality
    files creates/changed:
        schema.sql, db.js
        updated commands.js, register.js, index.js