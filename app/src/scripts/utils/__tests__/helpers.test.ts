import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCurrentDates, fillElementsWithData, manageFocus } from '../helpers';

describe('helpers', () => {
  describe('getCurrentDates', () => {
    beforeEach(() => {
      // 시간을 2026-02-21로 고정
      vi.useFakeTimers();
      const date = new Date(2026, 1, 21); // Month는 0-indexed (1 = 2월)
      vi.setSystemTime(date);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('현재 날짜 정보를 정확하게 반환한다.', () => {
      const result = getCurrentDates();
      
      expect(result.currentYear).toBe(2026);
      expect(result.currentMonth).toBe('02');
      expect(result.currentDay).toBe('21');
    });
  });

  describe('fillElementsWithData', () => {
    it('데이터의 키에 해당하는 클래스 요소에 텍스트를 채워야 한다.', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <span class="title"></span>
        <span class="author"></span>
      `;
      
      const data = { title: 'JS 완벽가이드', author: '데이브 플래너건' };
      fillElementsWithData(data, container);
      
      expect(container.querySelector('.title')?.textContent).toBe('JS 완벽가이드');
      expect(container.querySelector('.author')?.textContent).toBe('데이브 플래너건');
    });
  });

  describe('manageFocus', () => {
    it('지정한 요소에 포커스를 맞춰야 한다.', () => {
      const container = document.createElement('div');
      const target = document.createElement('h1');
      target.className = 'test-h1';
      container.appendChild(target);
      document.body.appendChild(container);

      manageFocus(container, '.test-h1');
      
      expect(document.activeElement).toBe(target);
      expect(target.getAttribute('tabindex')).toBe('-1');

      // cleanup
      document.body.removeChild(container);
    });
  });
});
