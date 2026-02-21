import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import FavoriteNav from '../FavoriteNav';
import bookModel from '@/model';

// Custom Element 등록
if (!customElements.get('favorite-nav')) {
  customElements.define('favorite-nav', FavoriteNav);
}

describe('FavoriteNav', () => {
  let element: FavoriteNav;

  beforeEach(() => {
    // bookModel 초기화
    bookModel.state = {
      favorites: { '소설': [], '만화': [] },
      favoriteCategoryOrder: ['소설', '만화'],
      libraries: {}
    };

    // DOM 설정
    document.body.innerHTML = `
      <overlay-category hidden></overlay-category>
    `;

    element = document.createElement('favorite-nav') as FavoriteNav;
    
    // 필수 하위 요소 생성 및 추가
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'favorite-category';
    element.appendChild(categoryContainer);

    const changeButton = document.createElement('button');
    changeButton.className = 'favorite-changeButton';
    element.appendChild(changeButton);

    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('초기화 시 bookModel의 카테고리들이 탭으로 생성되어야 한다.', () => {
    const navLinks = element.querySelectorAll('.favorite-category a');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toBe('소설');
    expect(navLinks[1].textContent).toBe('만화');
  });

  it('기본적으로 첫 번째 카테고리가 선택되어야 한다.', () => {
    const firstLink = element.querySelector('.favorite-category a') as HTMLAnchorElement;
    expect(firstLink.getAttribute('aria-selected')).toBe('true');
  });

  it('카테고리가 추가되면 UI도 업데이트되어야 한다.', () => {
    bookModel.addfavorite('에세이');
    const navLinks = element.querySelectorAll('.favorite-category a');
    expect(navLinks.length).toBe(3);
    expect(navLinks[2].textContent).toBe('에세이');
  });

  it('카테고리가 삭제되면 UI도 업데이트되어야 한다.', () => {
    bookModel.deleteFavorite('소설');
    const navLinks = element.querySelectorAll('.favorite-category a');
    expect(navLinks.length).toBe(1);
    expect(navLinks[0].textContent).toBe('만화');
  });

  it('편집 버튼을 클릭하면 overlay-category가 토글되어야 한다.', () => {
    const overlay = document.querySelector('overlay-category') as HTMLElement;
    const changeButton = element.querySelector('.favorite-changeButton') as HTMLButtonElement;
    
    expect(overlay.hidden).toBe(true);
    changeButton.click();
    expect(overlay.hidden).toBe(false);
  });
});
