import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { begin, end, updateMeetingToc } from './notes-toc.mjs';

const templatePattern = /^<details(?:\s+open)?>[ \t]*\r?\n[ \t]*<summary>\s*Template:\s*<\/summary>[ \t]*\r?\n([\s\S]*?)^<\/details>[ \t]*/im;
const placeholder = /^## DD MMM[ \t]*(?=\r?$)/m;

export function addMeeting(root, date) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC', year: 'numeric', month: 'numeric', day: '2-digit',
    }).formatToParts(date);
    const datePart = (type) => parts.find((part) => part.type === type).value;
    const quarter = Math.ceil(Number(datePart('month')) / 3);
    const directory = join(root, 'minutes', 'weekly-sync');
    const quarterName = `${datePart('year')}-Q${quarter}.md`;
    const file = join(directory, quarterName);
    const month = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC', month: 'short',
    }).format(date);
    const heading = `## ${datePart('day')} ${month}`;
    let source;
    let newQuarter = false;
    try {
        source = readFileSync(file, 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        newQuarter = true;
        for (const name of readdirSync(directory).filter((name) => /^\d{4}-Q[1-4]\.md$/.test(name) && name < quarterName).sort().reverse()) {
            const previous = readFileSync(join(directory, name), 'utf8');
            const template = templatePattern.exec(previous);
            if (!template || !placeholder.test(template[1])) continue;
            const newline = previous.includes('\r\n') ? '\r\n' : '\n';
            source = previous.slice(0, template.index + template[0].length)
                .replace(/^# Q[1-4] \d{4}(?= \/ Bokeh Weekly Sync)/, `# Q${quarter} ${datePart('year')}`)
                + newline + newline + '---' + newline + newline;
            break;
        }
        if (!source) throw new Error(`Could not find an earlier weekly-sync template to create ${file}`);
    }

    const newline = source.includes('\r\n') ? '\r\n' : '\n';
    const template = templatePattern.exec(source);
    if (!template || !placeholder.test(template[1])) {
        throw new Error(`Could not find the meeting template in ${file}`);
    }
    // Validate any existing marker pair before inserting text.
    const original = source;
    source = updateMeetingToc(source);
    const afterTemplate = template.index + template[0].length;
    const tail = source.slice(afterTemplate);
    const exists = tail.split(/\r?\n/).some((line) => line.trimEnd() === heading);
    const section = template[1].trim().replace(/^## DD MMM[ \t]*(?=\r?$)/m, heading)
        .replace(/[ \t]+(?=\r?$)/gm, '');
    let updated = source;
    if (!exists) {
        const tocEnd = tail.indexOf(end);
        const legacy = /^\[toc\][ \t]*(?=\r?$)/im.exec(tail);
        const insertion = tocEnd >= 0 ? tocEnd + end.length
            : legacy ? legacy.index + legacy[0].length
            : /^(?:\r?\n)+---[ \t]*(?=\r?$)/.exec(tail)?.[0].length ?? 0;
        const marker = tocEnd >= 0 || legacy ? '' : `${begin}${newline}${end}${newline}${newline}`;
        updated = source.slice(0, afterTemplate + insertion)
            + newline + newline + marker + section + tail.slice(insertion);
    }
    updated = updateMeetingToc(updated);
    if (newQuarter || updated !== original) {
        writeFileSync(file, updated, { flag: newQuarter ? 'wx' : 'w' });
    }
    console.log(`${exists ? 'Meeting already exists' : 'Created meeting'}: ${heading.slice(3)} in ${file}`);
}
