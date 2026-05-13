import fs from 'fs';
import path from 'path';

describe('Home page source', () => {
  it('contains the welcome heading text', () => {
    const pagePath = path.resolve(__dirname, '../app/page.md');
    const content = fs.readFileSync(pagePath, 'utf8');
    expect(content).toMatch(/Welcome back, Aya/);
  });
});
