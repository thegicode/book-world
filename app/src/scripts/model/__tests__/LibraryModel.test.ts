import { describe, it, expect, beforeEach } from 'vitest';
import LibraryModel from '../LibraryModel';

describe('LibraryModel', () => {
  let model: LibraryModel;
  const mockLibrary = { libCode: '111007', libName: '서울특별시교육청고덕평생학습관' };

  beforeEach(() => {
    model = new LibraryModel({});
  });

  it('도서관을 추가할 수 있다.', () => {
    model.add('111007', mockLibrary);
    expect(model.has('111007')).toBe(true);
    expect(model.libraries['111007']).toEqual(mockLibrary);
  });

  it('도서관 정보를 일괄 설정할 수 있다.', () => {
    const newLibraries = {
      '111125': { libCode: '111125', libName: '강동구립강일도서관' }
    };
    model.libraries = newLibraries;
    expect(model.has('111125')).toBe(true);
    expect(model.has('111007')).toBe(false);
  });

  it('도서관을 삭제할 수 있다.', () => {
    model.add('111007', mockLibrary);
    model.remove('111007');
    expect(model.has('111007')).toBe(false);
    expect(model.libraries).not.toHaveProperty('111007');
  });
});
