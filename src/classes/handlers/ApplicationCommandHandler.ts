import { readdirSync } from 'fs';
import { applicationCommand } from 'types/applicationCommand';
import { Collection } from 'discord.js';
export default class ApplicationCommandHandler {
    map: Collection<string, applicationCommand>;
    constructor() {
        // import commands
        this.map = new Collection();
    }
    loadCommands() {
        const dir = readdirSync(`${__dirname}/../../commands`);
        console.log(dir);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.map.set(
                name,
                await import(`${__dirname}/../../commands/${file}`)
            );
        });
        return this.map;
    }
}
