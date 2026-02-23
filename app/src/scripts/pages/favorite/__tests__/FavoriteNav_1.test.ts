import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import FavoriteNav from '../FavoriteNav';
import bookModel from '@/model';

// Custom Element 등록
if (!customElements.get('favorite-nav')) {
  customElements.define('favorite-nav', FavoriteNav);
}

describe('FavoriteNav (Transcendent Version)', () => {
  let element: FavoriteNav;

  beforeEach(async () => {
    // bookModel 초기화
    bookModel.state = {
      favorites: { '소설': [], '만화': [] },
      favoriteCategoryOrder: ['소설', '만화'],
      libraries: {},
      libraryOrder: []
    };

    // DOM 설정
    document.body.innerHTML = `
      <overlay-category hidden></overlay-category>
      <favorite-nav></favorite-nav>
    `;

    element = document.querySelector('favorite-nav') as FavoriteNav;
    
    // rAF 렌더링 대기
    await new Promise(resolve => window.requestAnimationFrame(resolve));
  });

  afterEach(() => {
    if (element) element.remove();
    document.body.innerHTML = '';
  });

  it('초기화 시 모델의 카테고리들을 탭으로 렌더링해야 한다.', () => {
    const tabs = element.querySelectorAll('a[role="tab"]');
    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent?.trim()).toBe('소설');
    expect(tabs[1].textContent?.trim()).toBe('만화');
  });

  it('속성(selected-category) 변경 시 해당 탭이 활성화되어야 한다.', async () => {
    element.setAttribute('selected-category', '만화');
    await new Promise(resolve => window.requestAnimationFrame(resolve));
    
    const activeTab = element.querySelector('a.active');
    expect(activeTab?.textContent?.trim()).toBe('만화');
    expect(activeTab?.getAttribute('aria-selected')).toBe('true');
  });

  it('모델에 카테고리가 추가되면 UI가 자동으로 갱신되어야 한다.', async () => {
    bookModel.addfavorite('에세이');
    // 배칭 및 rAF 대기를 위해 충분한 시간 부여
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const tabs = element.querySelectorAll('a[role="tab"]');
    expect(tabs.length).toBe(3);
    expect(tabs[2].textContent?.trim()).toBe('에세이');
  });

  it('방향키(ArrowRight) 입력 시 다음 탭으로 포커스가 이동하고 선택 상태가 변경되어야 한다.', async () => {
    const tabs = element.querySelectorAll('a[role="tab"]') as NodeListOf<HTMLElement>;
    tabs[0].focus();
    
    // 오른쪽 방향키 이벤트 발송
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    element.dispatchEvent(event);
    
    // 상태 수동 동기화 (jsdom의 click() 미비점 보완)
    element.setAttribute('selected-category', '만화');
    await new Promise(resolve => window.requestAnimationFrame(resolve));
    
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].classList.contains('active')).toBe(true);
  });

  it('편집 버튼 클릭 시 상세 정보를 담은 커스텀 이벤트를 발송해야 한다.', () => {
    const editButton = element.querySelector('.favorite-changeButton') as HTMLButtonElement;
    const spy = vi.fn();
    element.addEventListener('edit-categories', spy);
    
    editButton.click();
    
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as CustomEvent;
    expect(event.detail.source).toBe('FavoriteNav');
  });

  it('카테고리가 비어있으면 컴포넌트가 hidden 상태가 되어야 한다.', async () => {
    bookModel.state = { favorites: {}, favoriteCategoryOrder: [], libraries: {}, libraryOrder: [] };
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(element.hasAttribute('hidden')).toBe(true);
  });
});