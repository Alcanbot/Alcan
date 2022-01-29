import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const balance = await client.economy.get(
        interaction.user.id,
        interaction.guild.id
    );
    const cooldown = await client.economy.getCooldown(
        interaction.user.id,
        interaction.guild.id
    );
    if (cooldown.work > Date.now() / 1000) {
        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('WORK_COOLDOWN')
            .setLocaleDescription('WORK_COOLDOWN_DESCRIPTION');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const random = Math.floor(Math.random() * 3);
    const money = Math.floor(Math.random() * 200 + 1);
    const description = client.language.get(
        interaction.locale,
        'WORK_SUCCESS_DESCRIPTION'
    );
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('WORK_SUCCESS')
        .setDescription(
            description[random].replaceAll('[amount]', money.toString())
        );
    client.economy.add(interaction.user.id, interaction.guild.id, money);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('work')
    .setDescription('Get money from working!');
export const category: Category = 'economy';