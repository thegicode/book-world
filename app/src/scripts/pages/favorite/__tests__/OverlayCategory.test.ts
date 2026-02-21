import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import OverlayCategory from '../OverlayCategory';
import bookModel from '@/model';

// Custom Element 등록
if (!customElements.get('overlay-category')) {
  customElements.define('overlay-category', OverlayCategory);
}

describe('OverlayCategory', () => {
  let element: OverlayCategory;

  beforeEach(() => {
    // bookModel 초기화
    bookModel.state = {
      favorites: { '소설': [], '만화': [] },
      favoriteCategoryOrder: ['소설', '만화'],
      libraries: {}
    };

    // 템플릿 및 기본 DOM 설정
    document.body.innerHTML = `
      <template id="tp-category-item">
        <li class="category-item">
          <button class="dragger">::</button>
          <input type="text" name="category" />
          <button class="renameButton">수정</button>
          <button class="deleteButton">삭제</button>
        </li>
      </template>
    `;

    element = document.createElement('overlay-category') as OverlayCategory;
    
    // 필수 하위 요소 생성 및 추가
    const form = document.createElement('form');
    const addInput = document.createElement('input');
    addInput.name = 'add';
    const addButton = document.createElement('button');
    addButton.className = 'addButton';
    addButton.textContent = '추가';
    form.appendChild(addInput);
    form.appendChild(addButton);
    element.appendChild(form);

    const list = document.createElement('ul');
    list.className = 'category-list';
    element.appendChild(list);

    const closeButton = document.createElement('button');
    closeButton.className = 'closeButton';
    element.appendChild(closeButton);

    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('초기화 시 카테고리 목록을 렌더링해야 한다.', () => {
    const items = element.querySelectorAll('.category-list li');
    expect(items.length).toBe(2);
    
    const inputs = element.querySelectorAll('input[name="category"]') as NodeListOf<HTMLInputElement>;
    expect(inputs[0].value).toBe('소설');
    expect(inputs[1].value).toBe('만화');
  });

  it('새 카테고리를 추가할 수 있어야 한다.', () => {
    const addInput = element.querySelector('input[name="add"]') as HTMLInputElement;
    const addButton = element.querySelector('.addButton') as HTMLButtonElement;
    
    addInput.value = '에세이';
    addButton.click();
    
    expect(bookModel.favoriteCategoryOrder).toContain('에세이');
    const items = element.querySelectorAll('.category-list li');
    expect(items.length).toBe(3);
    expect((items[2].querySelector('input') as HTMLInputElement).value).toBe('에세이');
  });

  it('카테고리를 삭제할 수 있어야 한다.', () => {
    const deleteButton = element.querySelector('.deleteButton') as HTMLButtonElement;
    
    deleteButton.click();
    
    expect(bookModel.favoriteCategoryOrder).not.toContain('소설');
    const items = element.querySelectorAll('.category-list li');
    expect(items.length).toBe(1);
  });

  it('카테고리 이름을 수정할 수 있어야 한다.', () => {
    const firstItem = element.querySelector('.category-list li') as HTMLElement;
    const input = firstItem.querySelector('input[name="category"]') as HTMLInputElement;
    const renameButton = firstItem.querySelector('.renameButton') as HTMLButtonElement;
    
    input.value = '문학';
    renameButton.click();
    
    expect(bookModel.favorites).toHaveProperty('문학');
    expect(bookModel.favorites).not.toHaveProperty('소설');
  });

  it('닫기 버튼 클릭 시 hidden 속성이 설정되어야 한다.', () => {
    const closeButton = element.querySelector('.closeButton') as HTMLButtonElement;
    
    expect(element.hidden).toBe(false);
    closeButton.click();
    expect(element.hidden).toBe(true);
  });
});
