import { test, expect } from '@playwright/test';

test('Klangwahl ist mobil erreichbar, sofort stumm und nach Neustart erhalten', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
  await page.getByRole('button', { name: 'Optionen', exact: true }).click();
  const group = page.getByRole('group', { name: 'Lautstärke der Spielklänge' });
  const music = page.getByRole('group', { name: 'Lautstärke der Begleitmusik' });
  await expect(group.getByRole('button', { name: 'Leise' })).toHaveAttribute('aria-pressed', 'true');
  await expect(music.getByRole('button', { name: 'Aus' })).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    window.__played = [];
    window.Audio = class {
      constructor(src) { this.src = src; this.ended = false; this.paused = true; window.__played.push(src); }
      play() { this.paused = false; return Promise.resolve(); }
      pause() { this.paused = true; }
    };
  });
  await group.getByRole('button', { name: 'Normal' }).click();
  await expect(group.getByRole('button', { name: 'Normal' })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => window.__played.length)).toBeGreaterThan(0);
  await group.getByRole('button', { name: 'Aus' }).click();
  const count = await page.evaluate(() => window.__played.length);
  await music.getByRole('button', { name: 'Leise' }).click();
  await expect.poll(() => page.evaluate(() => window.__played.some(s => s.endsWith('/music/ankommen.ogg')))).toBe(true);
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__played.length)).toBeGreaterThan(count);
  await page.reload();
  await page.getByRole('button', { name: 'Optionen', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Lautstärke der Spielklänge' })
    .getByRole('button', { name: 'Aus' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('group', { name: 'Lautstärke der Begleitmusik' })
    .getByRole('button', { name: 'Leise' })).toHaveAttribute('aria-pressed', 'true');
});
