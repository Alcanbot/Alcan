import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandUserOption } from 'discord.js';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandUserOption
export class UserOption extends BaseOptionBuilder<SlashCommandUserOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.User, baseKey);
        this.builder = new SlashCommandUserOption();
    }
}