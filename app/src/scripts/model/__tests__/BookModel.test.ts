import { describe, it, expect, beforeEach, vi } from 'vitest';

// BookModel은 싱글톤이므로 모듈을 매 테스트마다 재로드
let bookModel: typeof import('../index').default;
let BookModelEvent: typeof import('../index').BookModelEvent;

describe('BookModel', () => {
  beforeEach(async () => {
    localStorage.clear();
    // 모듈 캐시를 초기화하여 싱글톤 재생성
    vi.resetModules();
    const mod = await import('../index');
    bookModel = mod.default;
    BookModelEvent = mod.BookModelEvent;
  });

  describe('초기화', () => {
    it('localStorage가 비어있으면 기본 상태로 초기화된다.', () => {
      expect(bookModel.state).toEqual({
        favorites: {},
        favoriteCategoryOrder: [],
        libraries: {},
        libraryOrder: [],
      });
    });

    it('localStorage에 저장된 데이터를 로드한다.', async () => {
      const savedState = {
        favorites: { '소설': ['isbn1'] },
        favoriteCategoryOrder: ['소설'],
        libraries: {},
        libraryOrder: [],
      };
      localStorage.setItem('BookWorld', JSON.stringify(savedState));

      vi.resetModules();
      const mod = await import('../index');
      const reloadedModel = mod.default;

      expect(reloadedModel.favoriteCategoryOrder).toEqual(['소설']);
      expect(reloadedModel.favorites['소설']).toEqual(['isbn1']);
    });
  });

  describe('마이그레이션', () => {
    it('sortedFavoriteKeys를 favoriteCategoryOrder로 마이그레이션한다.', async () => {
      const oldData = {
        favorites: { '에세이': [] },
        sortedFavoriteKeys: ['에세이'],
        libraries: {},
        libraryOrder: [],
      };
      localStorage.setItem('BookWorld', JSON.stringify(oldData));

      vi.resetModules();
      const mod = await import('../index');
      expect(mod.default.favoriteCategoryOrder).toEqual(['에세이']);
    });

    it('libraryOrder가 없으면 libraries 키에서 자동 생성한다.', async () => {
      const oldData = {
        favorites: {},
        favoriteCategoryOrder: [],
        libraries: { '111007': { libCode: '111007', libName: '테스트도서관' } },
      };
      localStorage.setItem('BookWorld', JSON.stringify(oldData));

      vi.resetModules();
      const mod = await import('../index');
      expect(mod.default.libraryOrder).toEqual(['111007']);
    });
  });

  describe('state getter (computed)', () => {
    it('sub-model 데이터를 실시간으로 반영한다.', () => {
      bookModel.addFavorite('소설');
      const state = bookModel.state;

      expect(state.favorites).toHaveProperty('소설');
      expect(state.favoriteCategoryOrder).toContain('소설');
    });

    it('state getter가 깊은 복사를 반환한다.', () => {
      bookModel.addFavorite('소설');
      bookModel.addFavoriteBook('소설', 'isbn1');

      const state1 = bookModel.state;
      const state2 = bookModel.state;

      // 서로 다른 참조여야 한다
      expect(state1).not.toBe(state2);
      expect(state1.favorites['소설']).not.toBe(state2.favorites['소설']);
    });
  });

  describe('state setter', () => {
    it('state를 설정하면 sub-model과 localStorage에 반영된다.', () => {
      const newState = {
        favorites: { '에세이': ['isbn1'] },
        favoriteCategoryOrder: ['에세이'],
        libraries: { '111007': { libCode: '111007', libName: '테스트도서관' } },
        libraryOrder: ['111007'],
      };

      bookModel.state = newState;

      expect(bookModel.favorites).toEqual(newState.favorites);
      expect(bookModel.favoriteCategoryOrder).toEqual(newState.favoriteCategoryOrder);
      expect(bookModel.libraries).toEqual(newState.libraries);
      expect(bookModel.libraryOrder).toEqual(newState.libraryOrder);

      // localStorage에도 저장되었는지 확인
      const stored = JSON.parse(localStorage.getItem('BookWorld')!);
      expect(stored.favoriteCategoryOrder).toEqual(['에세이']);
    });
  });

  describe('_commit (localStorage 저장)', () => {
    it('mutation 후 자동으로 localStorage에 저장된다.', () => {
      bookModel.addFavorite('소설');

      const stored = JSON.parse(localStorage.getItem('BookWorld')!);
      expect(stored.favorites).toHaveProperty('소설');
      expect(stored.favoriteCategoryOrder).toContain('소설');
    });

    it('BookStateUpdate 이벤트를 발행한다.', () => {
      const callback = vi.fn();
      bookModel.getPublisher(BookModelEvent.BookStateUpdate).subscribe(callback);

      bookModel.addFavorite('소설');

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Favorite 메서드', () => {
    it('addFavorite: 카테고리를 추가한다.', () => {
      bookModel.addFavorite('소설');
      expect(bookModel.hasFavorite('소설')).toBe(true);
      expect(bookModel.favoriteCategoryOrder).toContain('소설');
    });

    it('renameFavorite: 카테고리 이름을 변경한다.', () => {
      bookModel.addFavorite('소설');
      bookModel.renameFavorite('소설', '문학');

      expect(bookModel.hasFavorite('소설')).toBe(false);
      expect(bookModel.hasFavorite('문학')).toBe(true);
      expect(bookModel.favoriteCategoryOrder).toContain('문학');
    });

    it('deleteFavorite: 카테고리를 삭제한다.', () => {
      bookModel.addFavorite('소설');
      bookModel.deleteFavorite('소설');

      expect(bookModel.hasFavorite('소설')).toBe(false);
      expect(bookModel.favoriteCategoryOrder).not.toContain('소설');
    });

    it('addFavoriteBook / removeFavoriteBook: 도서를 카테고리에 추가/제거한다.', () => {
      bookModel.addFavorite('소설');
      bookModel.addFavoriteBook('소설', 'isbn123');

      expect(bookModel.hasFavoriteBook('소설', 'isbn123')).toBe(true);

      bookModel.removeFavoriteBook('소설', 'isbn123');
      expect(bookModel.hasFavoriteBook('소설', 'isbn123')).toBe(false);
    });
  });

  describe('Library 메서드', () => {
    const mockLib = { libCode: '111007', libName: '테스트도서관' };

    it('addLibrary: 도서관을 추가한다.', () => {
      bookModel.addLibrary('111007', mockLib);

      expect(bookModel.hasLibrary('111007')).toBe(true);
      expect(bookModel.libraryOrder).toContain('111007');
    });

    it('removeLibrary: 도서관을 제거한다.', () => {
      bookModel.addLibrary('111007', mockLib);
      bookModel.removeLibrary('111007');

      expect(bookModel.hasLibrary('111007')).toBe(false);
      expect(bookModel.libraryOrder).not.toContain('111007');
    });
  });

  describe('resetState', () => {
    it('상태를 초기값으로 리셋한다.', () => {
      bookModel.addFavorite('소설');
      bookModel.addLibrary('111007', { libCode: '111007', libName: '테스트' });

      bookModel.resetState();

      expect(bookModel.favorites).toEqual({});
      expect(bookModel.favoriteCategoryOrder).toEqual([]);
      expect(bookModel.libraries).toEqual({});
      expect(bookModel.libraryOrder).toEqual([]);
    });
  });

  describe('getPublisher', () => {
    it('이벤트별 Publisher를 반환한다.', () => {
      const pub = bookModel.getPublisher(BookModelEvent.LibraryUpdate);
      expect(pub).toBeDefined();
      expect(typeof pub.subscribe).toBe('function');
      expect(typeof pub.unsubscribe).toBe('function');
    });
  });
});
