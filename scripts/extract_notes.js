
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoPath = 'c:/Users/Mi5a/atplvector/external_theory';
const outputPath = 'c:/Users/Mi5a/atplvector/extracted_notes';

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

const files = fs.readdirSync(repoPath).filter(f => f.endsWith('.html') && !f.includes('@') && f !== 'index.html' && f !== 'subjects.html' && f !== 'sign-up.html' && f !== 'account.html' && f !== 'contact-us.html' && f !== 'sample.html');

files.forEach(file => {
    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(path.join(repoPath, file), 'utf8');
    const $ = cheerio.load(content);

    const accordion = $('.sp-easy-accordion');
    let markdown = `# ${file.replace('.html', '').replace(/-/g, ' ').toUpperCase()}\n\n`;

    if (accordion.length > 0) {
        accordion.find('.ea-card').each((_, card) => {
            const $card = $(card);
            const header = $card.find('.ea-header').text().trim() || 'Untitled Section';
            const body = $card.find('.ea-body');

            markdown += `## ${header}\n\n`;

            if (body.length > 0) {
                body.contents().each((_, node) => {
                    const $node = $(node);
                    const tagName = node.tagName?.toUpperCase();

                    if (tagName === 'H4') {
                        markdown += `### ${$node.text().trim()}\n\n`;
                    } else if (tagName === 'P') {
                        markdown += `${$node.text().trim()}\n\n`;
                    } else if (tagName === 'UL') {
                        $node.find('li').each((_, li) => {
                            const $li = $(li);
                            const $subUl = $li.find('ul');
                            if ($subUl.length > 0) {
                                const $linkClone = $li.clone();
                                $linkClone.find('ul').remove();
                                markdown += `- ${$linkClone.text().trim()}\n`;
                                $subUl.find('li').each((_, subLi) => {
                                    markdown += `  - ${$(subLi).text().trim()}\n`;
                                });
                            } else {
                                markdown += `- ${$li.text().trim()}\n`;
                            }
                        });
                        markdown += '\n';
                    } else if (tagName === 'TABLE') {
                        const rows = $node.find('tr');
                        rows.each((i, row) => {
                            const cells = $(row).find('th, td');
                            let rowText = '|';
                            cells.each((_, cell) => {
                                rowText += ` ${$(cell).text().trim().replace(/\n/g, ' ')} |`;
                            });
                            markdown += rowText + '\n';
                            if (i === 0) {
                                markdown += '|' + cells.map(() => ' --- |').get().join('') + '\n';
                            }
                        });
                        markdown += '\n';
                    }
                });
            }
        });
    } else {
        const main = $('.entry-content');
        if (main.length > 0) {
            markdown += main.text().trim();
        }
    }

    fs.writeFileSync(path.join(outputPath, file.replace('.html', '.md')), markdown);
});

console.log('Extraction complete!');
