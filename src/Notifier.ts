import assert from 'assert';
import consola from 'consola';
import { TextChannel } from 'discord.js-selfbot-v13';
import { client } from '.';
import config from '../config.json';

const delay = (x: any) => new Promise((resolve) => setTimeout(resolve, x));

export interface DataT {
	username: string;
	id: string;
	avatar: string;
	location: string;
	content: string;
	type: 'DM' | 'サーバー';
	date: number;
}

export async function SendLog(data: DataT) {
	consola.info(`[Discord] ${data.content}`);
	const mention = `<@${config.notify.mentionID}>`;

	const res = await fetch(config.notify.url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: `${data.username} (${data.id})`,
			avatar_url: data.avatar,
			content: mention,
			embeds: [
				{
					title: `[${data.type}] 🔔 ${data.username}からのメッセージ (<t:${Math.round(new Date().getTime() / 1000)}:R>)`,
					description: data.content,
					color: '9340103',
					fields: [
						{
							name: 'メッセージ元',
							value: data.location,
						},
					],
				},
			],
			allowed_mentions: {
				users: [`${config.notify.mentionID}`],
			},
		}),
	});
	if (!res.ok) {
		consola.error(`[Webhook] Req failed with ${res.status}`);
		consola.error(await res.json());
		const after = parseInt(res.headers.get('X-RateLimit-Reset-After') ?? '10') + 1;
		consola.info(`[Webhook] retry after ${after} seconds...`);
		await delay(1000 * after);
		consola.info(`[Webhook] retrying...`);
		SendLog(data);
	} else {
		const remain = res.headers.get('X-RateLimit-Remaining');
		consola.log(`[Debug] RateLimit Remain: ${remain}`);
	}
}
