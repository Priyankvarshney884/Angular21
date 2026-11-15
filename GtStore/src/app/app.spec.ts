import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the signals lesson', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular signals, in action');
  });

  it('updates the cart subtotal when the quantity signal changes', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const increaseButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Increase quantity"]',
    );
    const decreaseButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Decrease quantity"]',
    );
    expect(decreaseButton.disabled).toBe(true);

    increaseButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('output').textContent.trim()).toBe('2');
    expect(fixture.nativeElement.querySelector('.subtotal-card strong').textContent.trim()).toBe(
      '$99.98',
    );

    fixture.nativeElement.querySelector('.reset-button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('output').textContent.trim()).toBe('1');
  });

  it('does not allow the quantity to exceed the configured limit', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const increaseButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Increase quantity"]',
    );
    for (let index = 0; index < 5; index += 1) {
      increaseButton.click();
      fixture.detectChanges();
    }

    expect(fixture.nativeElement.querySelector('output').textContent.trim()).toBe('5');
    expect(increaseButton.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain("You've reached the limit of 5 items.");
  });
});
