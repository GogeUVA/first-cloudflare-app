/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx) {
// 		return new Response("Hello World!");
// 	},
// };

/**
 * The core server that runs on a Cloudflare worker.
 */
import { AutoRouter } from 'itty-router';
import {
  InteractionType,
  InteractionResponseType,
  verifyKey,
} from 'discord-interactions';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from './db.js';
import { getWeather } from './weather.js';

const router = AutoRouter();

class JsonResponse extends Response {
  constructor(body, init = {}) {
    super(JSON.stringify(body), {
      ...init,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  }
}

router.get('/', () => {
  return new Response('Discord bot is running');
});

router.post('/', async (request, env) => {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();

  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(
      body,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY
    ));

  if (!isValidRequest) {
    return new Response('Bad request signature.', { status: 401 });
  }

  const interaction = JSON.parse(body);

  // Discord webhook verification
  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  // Slash commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {

    const { name, options = [] } = interaction.data;

    const userId = interaction.member.user.id;

    function getOption(name) {
      return options.find(o => o.name === name)?.value;
    }

    // TEST COMMAND
    if (name === 'test') {
      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'hello world',
        },
      });
    }

    // CREATE NOTE
    if (name === 'create') {

      const title = getOption('title');
      const content = getOption('content');

      await createNote(env.DB, userId, title, content);

      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Created note "${title}"`,
        },
      });
    }

    // LIST NOTES
    if (name === 'list') {

      const notes = await getNotes(env.DB, userId);

      if (notes.length === 0) {
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'No notes found.',
          },
        });
      }

      const text = notes
        .map(note =>
          `#${note.id} - ${note.title}\n${note.content}`
        )
        .join('\n\n');

      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: text,
        },
      });
    }

    // UPDATE NOTE
    if (name === 'update') {

      const id = getOption('id');
      const content = getOption('content');

      await updateNote(env.DB, id, content);

      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Updated note #${id}`,
        },
      });
    }

    // DELETE NOTE
    if (name === 'delete') {

      const id = getOption('id');

      await deleteNote(env.DB, id);

      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Deleted note #${id}`,
        },
      });
    }

    // WEATHER
    if (name === 'weather') {

      const city = getOption('city');
      const state = getOption('state');

      try {

        const weather = await getWeather(city, state);

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              `Weather for ${weather.city}, ${weather.state}\n\n` +
              `Temperature: ${weather.temperature}°${weather.unit}\n` +
              `Wind: ${weather.wind}\n` +
              `Forecast: ${weather.forecast}`,
          },
        });

      } catch (err) {

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Error: ${err.message}`,
          },
        });

      }
    }    
  }

  return new Response('Not found', { status: 404 });
});

export default {
  fetch: router.fetch,
};