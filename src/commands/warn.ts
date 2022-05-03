import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    if (!interaction.member?.permissions.has('MODERATE_MEMBERS')) {
        return interaction.reply({
            content: client.i18n.t('WARN_PERMISSIONS_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? client.i18n.t('NONE', { lng: interaction.locale });

    if (!member) {
        return interaction.reply({
            content: client.i18n.t('WARN_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (member.user.id === interaction.user.id) {
        return interaction.reply({
            content: client.i18n.t('WARN_ERROR_YOURSELF', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (reason.length > 1024) {
        return interaction.reply({
            content: client.i18n.t('REASON_LONGER_THAN_1024', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const caseObj = await client.cases.create(interaction.guildId, member.user, interaction.user, 'warn', reason);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('WARN_SUCCESS_TITLE')
        .setLocaleDescription('WARN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'WARN_MODERATOR', value: interaction.user.tag })
        .addLocaleField({ name: 'WARN_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'CASE_ID', value: caseObj.case_id.toString() });

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const data = new SlashCommandBuilder()
    .setName('warn')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Warn a user from the server')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Provide a user to warn')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Provide a reason for warning this user')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(false)
    );

export const category: Category = 'moderation';
