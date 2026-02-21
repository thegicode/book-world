import { describe, it, expect, beforeEach } from 'vitest';
import FavoriteModel from '../FavoriteModel';

describe('FavoriteModel', () => {
  let model: FavoriteModel;

  beforeEach(() => {
    // 매 테스트 전 초기화
    model = new FavoriteModel({}, []);
  });

  it('카테고리를 추가할 수 있다.', () => {
    model.add('소설');
    expect(model.favorites).toHaveProperty('소설');
    expect(model.favorites['소설']).toEqual([]);
  });

  it('카테고리 순서(categoryOrder)에 이름을 추가할 수 있다.', () => {
    model.addCategoryOrder('소설');
    expect(model.categoryOrder).toContain('소설');
    expect(model.categoryOrder.length).toBe(1);
  });

  it('카테고리 이름을 변경할 수 있다.', () => {
    model.add('소설');
    model.rename('소설', '문학');
    expect(model.favorites).not.toHaveProperty('소설');
    expect(model.favorites).toHaveProperty('문학');
  });

  it('카테고리 순서 배열에서도 이름을 변경할 수 있다.', () => {
    model.addCategoryOrder('소설');
    model.renameCategoryOrder('소설', '문학');
    expect(model.categoryOrder).toContain('문학');
    expect(model.categoryOrder).not.toContain('소설');
  });

  it('카테고리를 삭제하면 순서 배열에서도 삭제되어야 한다.', () => {
    model.add('소설');
    model.addCategoryOrder('소설');
    
    model.delete('소설');
    const index = model.deleteCategoryOrder('소설');
    
    expect(model.favorites).not.toHaveProperty('소설');
    expect(model.categoryOrder).not.toContain('소설');
    expect(index).toBe(0);
  });

  it('관심 도서(ISBN)를 추가할 수 있다.', () => {
    model.add('소설');
    model.addBook('소설', '9781234567890');
    expect(model.hasBook('소설', '9781234567890')).toBe(true);
  });

  it('관심 도서를 삭제할 수 있다.', () => {
    model.add('소설');
    model.addBook('소설', '9781234567890');
    model.removeBook('소설', '9781234567890');
    expect(model.hasBook('소설', '9781234567890')).toBe(false);
  });
});
