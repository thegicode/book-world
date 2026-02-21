import { describe, it, expect, beforeEach } from 'vitest';
import CategorySelector from '../CategorySelector';
import bookModel from '@/model';

// Custom Element 등록 (한 번만 등록해야 함)
if (!customElements.get('category-selector')) {
  customElements.define('category-selector', CategorySelector);
}

describe('CategorySelector', () => {
  let element: CategorySelector;

  beforeEach(() => {
    // bookModel 상태 초기화 (또는 모킹)
    bookModel.state = {
      favorites: { '소설': [], '만화': [] },
      favoriteCategoryOrder: ['소설', '만화'],
      libraries: {}
    };

    element = document.createElement('category-selector') as CategorySelector;
    document.body.appendChild(element);
  });

  it('초기화 시 버튼과 컨테이너가 생성되어야 한다.', () => {
    const button = element.querySelector('.category-button');
    const container = element.querySelector('.category');
    
    expect(button).not.toBeNull();
    expect(container).not.toBeNull();
    expect(button?.textContent?.trim()).toBe('Category');
  });

  it('bookModel의 카테고리 수만큼 아이템이 생성되어야 한다.', () => {
    const labels = element.querySelectorAll('.category label');
    expect(labels.length).toBe(2);
    expect(labels[0].textContent?.trim()).toBe('소설');
    expect(labels[1].textContent?.trim()).toBe('만화');
  });

  it('버튼 클릭 시 컨테이너의 hidden 상태가 토글되어야 한다.', () => {
    const button = element.querySelector('.category-button') as HTMLButtonElement;
    const container = element.querySelector('.category') as HTMLElement;
    
    // lit-html의 ?hidden 바인딩은 속성 존재 여부로 결정됨
    expect(container.hasAttribute('hidden')).toBe(true);
    button.click();
    expect(container.hasAttribute('hidden')).toBe(false);
    button.click();
    expect(container.hasAttribute('hidden')).toBe(true);
  });

  it('체크박스 클릭 시 bookModel에 책을 추가하거나 삭제해야 한다.', () => {
    // 가상의 ISBN 부모 요소 설정
    const parent = document.createElement('div');
    parent.dataset.isbn = '12345';
    parent.appendChild(element);
    
    // 강제로 isbn 재인식 시키기 (커스텀 엘리먼트 내부 private 접근 대신 constructor 다시 호출하는 느낌으로 우회)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (element as any).isbn = '12345'; 

    const checkbox = element.querySelector('input[type="checkbox"]') as HTMLInputElement;
    
    // 체크박스 클릭 (추가)
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    expect(bookModel.hasFavoriteBook('소설', '12345')).toBe(true);

    // 다시 클릭 (삭제)
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    expect(bookModel.hasFavoriteBook('소설', '12345')).toBe(false);
  });
});
