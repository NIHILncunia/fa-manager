import { Client } from 'discord.js';

export default function botReady(client: Client<true>) {
  console.log(`[${client.user.username}] 봇이 로그인 상태입니다.`);
}
