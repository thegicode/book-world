import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import FavoriteNav from '../FavoriteNav';
import bookModel from '@/model';

describe('FavoriteNav Component', () => {
    let element: FavoriteNav;
    let container: HTMLElement;

    // Helper to wait for the next animation frame (where render happens)
    const waitForRender = () => new Promise(resolve => requestAnimationFrame(resolve));

    beforeEach(async () => {
        // Reset and Initialize Model State using public setter
        // This ensures internal sub-models (FavoriteModel, LibraryModel) are synced
        bookModel.state = {
            favorites: { 'Novel': [], 'Comics': [], 'Essay': [] },
            favoriteCategoryOrder: ['Novel', 'Comics', 'Essay'],
            libraries: {},
            libraryOrder: []
        };
        
        container = document.createElement('div');
        document.body.appendChild(container);

        if (!customElements.get('favorite-nav')) {
            customElements.define('favorite-nav', FavoriteNav);
        }

        element = document.createElement('favorite-nav') as FavoriteNav;
        container.appendChild(element);

        // Wait for initial render
        await waitForRender();
    });

    afterEach(() => {
        if (container.parentNode) {
            document.body.removeChild(container);
        }
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('renders all categories from the model', () => {
            const tabs = element.querySelectorAll('[role="tab"]');
            expect(tabs.length).toBe(3);
            expect(tabs[0].textContent?.trim()).toBe('Novel');
            expect(tabs[1].textContent?.trim()).toBe('Comics');
            expect(tabs[2].textContent?.trim()).toBe('Essay');
        });

        it('selects the first category by default if no attribute is set', () => {
            const firstTab = element.querySelector('[role="tab"]:first-child');
            expect(firstTab?.classList.contains('active')).toBe(true);
            expect(firstTab?.getAttribute('aria-selected')).toBe('true');
        });

        it('hides itself if there are no categories', async () => {
            // Update state to empty
            bookModel.state = {
                favorites: {},
                favoriteCategoryOrder: [],
                libraries: {},
                libraryOrder: []
            };
            
            await waitForRender();

            expect(element.hidden).toBe(true);
        });
    });

    describe('Interaction & Reactivity', () => {
        it('updates active tab when "selected-category" attribute changes', async () => {
            element.setAttribute('selected-category', 'Comics');
            await waitForRender();

            const activeTab = element.querySelector('[role="tab"][aria-selected="true"]');
            expect(activeTab?.textContent?.trim()).toBe('Comics');
        });

        it('reflects attribute change back to property (single source of truth)', async () => {
            // Setting attribute manually
            element.setAttribute('selected-category', 'Essay');
            await waitForRender();
            
            // Internal state should match
            const activeTab = element.querySelector('.active');
            expect(activeTab?.textContent?.trim()).toBe('Essay');
        });

        it('dispatches "edit-categories" event when edit button is clicked', () => {
            const spy = vi.fn();
            element.addEventListener('edit-categories', spy);

            const btn = element.querySelector('.favorite-changeButton') as HTMLButtonElement;
            expect(btn).not.toBeNull();
            btn.click();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][0].detail.source).toBe('FavoriteNav');
        });
    });

    describe('Keyboard Navigation (A11y)', () => {
        const dispatchKey = (key: string) => {
            const activeElement = document.activeElement as HTMLElement;
            activeElement.dispatchEvent(new KeyboardEvent('keydown', {
                key,
                bubbles: true,
                cancelable: true
            }));
        };

        it('moves focus to next tab on ArrowRight', async () => {
            const tabs = element.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
            expect(tabs.length).toBeGreaterThan(1);
            tabs[0].focus();

            dispatchKey('ArrowRight');
            await waitForRender();

            expect(document.activeElement).toBe(tabs[1]);
        });

        it('moves focus to previous tab on ArrowLeft (wrapping)', async () => {
            const tabs = element.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
            tabs[0].focus();

            dispatchKey('ArrowLeft');
            await waitForRender();
            
            expect(document.activeElement).toBe(tabs[2]); // Last item
        });

        it('moves focus to first tab on Home', async () => {
            const tabs = element.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
            tabs[2].focus();

            dispatchKey('Home');
            await waitForRender();

            expect(document.activeElement).toBe(tabs[0]);
        });

        it('moves focus to last tab on End', async () => {
            const tabs = element.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
            tabs[0].focus();

            dispatchKey('End');
            await waitForRender();

            expect(document.activeElement).toBe(tabs[2]);
        });

        it('activates tab on Enter', () => {
            const tabs = element.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
            const targetTab = tabs[1];
            
            // Mock click since Enter calls click()
            const clickSpy = vi.spyOn(targetTab, 'click');
            
            targetTab.focus();
            dispatchKey('Enter');

            expect(clickSpy).toHaveBeenCalled();
        });
    });

    describe('Lifecycle & Controller', () => {
        it('cleans up event listeners when disconnected', () => {
            const removeSpy = vi.spyOn(element, 'removeEventListener');
            
            element.remove();
            
            expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
            expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));
        });
    });
});
