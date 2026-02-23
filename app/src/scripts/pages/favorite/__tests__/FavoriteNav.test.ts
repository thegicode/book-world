import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import FavoriteNav from '../FavoriteNav';
import bookModel from '../../../model'; 

// Custom Element 등록
if (!customElements.get('favorite-nav')) {
  customElements.define('favorite-nav', FavoriteNav);
}

describe('FavoriteNav', () => {
  let element: FavoriteNav;

  beforeEach(async () => {
    // bookModel 초기화
    bookModel.state = {
      favorites: { '소설': [], '만화': [] },
      favoriteCategoryOrder: ['소설', '만화'],
      libraries: {}
    };

    // DOM 설정 (lit-html이 렌더링할 컨테이너들만 준비)
    document.body.innerHTML = `
      <overlay-category hidden></overlay-category>
      <favorite-nav></favorite-nav>
    `;

    element = document.querySelector('favorite-nav') as FavoriteNav;
    await new Promise(resolve => setTimeout(resolve, 0)); // 초기 렌더링 대기
  });

  afterEach(() => {
    if (element) {
      element.remove(); // disconnectedCallback 호출 유도
    }
    document.body.innerHTML = '';
  });

  it('초기화 시 bookModel의 카테고리들이 탭으로 생성되어야 한다.', async () => {
    await new Promise(resolve => window.requestAnimationFrame(resolve)); // rAF 대기
    const navLinks = element.querySelectorAll('.favorite-category a');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent?.trim()).toBe('소설');
    expect(navLinks[1].textContent?.trim()).toBe('만화');
  });

  it('selected-category 속성을 변경하면 UI가 자동으로 업데이트되어야 한다.', async () => {
    element.setAttribute('selected-category', '만화');
    await new Promise(resolve => window.requestAnimationFrame(resolve)); // rAF 대기
    
    const activeLink = element.querySelector('a.active');
    expect(activeLink?.textContent?.trim()).toBe('만화');
    expect(activeLink?.getAttribute('aria-selected')).toBe('true');
  });

  it('카테고리가 추가되면 배칭 시스템(rAF)을 거쳐 UI가 업데이트되어야 한다.', async () => {
    bookModel.addfavorite('에세이');
    await new Promise(resolve => setTimeout(resolve, 50)); // rAF 및 배칭 대기
    
    const navLinks = element.querySelectorAll('.favorite-category a');
    expect(navLinks.length).toBe(3);
    expect(navLinks[2].textContent?.trim()).toBe('에세이');
  });

  it('유효하지 않은 selected-category는 첫 번째 카테고리로 보정되어야 한다.', async () => {
    element.setAttribute('selected-category', '없는카테고리');
    await new Promise(resolve => window.requestAnimationFrame(resolve));

    const activeLink = element.querySelector('a.active');
    expect(activeLink?.textContent?.trim()).toBe('소설');
    expect(element.getAttribute('selected-category')).toBe('소설');
  });

  it('ArrowRight 입력 시 다음 탭으로 포커스만 이동해야 한다.', async () => {
    await new Promise(resolve => window.requestAnimationFrame(resolve));
    const tabs = element.querySelectorAll('.favorite-category a') as NodeListOf<HTMLElement>;
    tabs[0].focus();

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('편집 버튼을 클릭하면 상세 정보를 포함한 커스텀 이벤트가 발생해야 한다.', async () => {
    await new Promise(resolve => window.requestAnimationFrame(resolve));
    const changeButton = element.querySelector('.favorite-changeButton') as HTMLButtonElement;
    const spy = vi.fn();
    element.addEventListener('edit-categories', spy);
    
    changeButton.click();
    
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as CustomEvent;
    expect(event.detail.source).toBe('FavoriteNav');
  });

  it('카테고리가 모두 삭제되면 컴포넌트가 hidden 속성을 가져야 한다.', async () => {
    bookModel.state = { favorites: {}, favoriteCategoryOrder: [], libraries: {} };
    await new Promise(resolve => setTimeout(resolve, 100)); // 충분한 대기
    
    expect(element.hasAttribute('hidden')).toBe(true);
  });
});
