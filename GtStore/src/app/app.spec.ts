import { TestBed } from '@angular/core/testing';
import { App } from './app';

function findCard(root: HTMLElement, heading: string): HTMLElement {
  const card = Array.from(root.querySelectorAll<HTMLElement>('.concept-card')).find((candidate) =>
    candidate.querySelector('h3')?.textContent?.includes(heading),
  );
  if (!card) {
    throw new Error(`Could not find concept card: ${heading}`);
  }
  return card;
}

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

  it('keeps incidental reads untracked until a tracked signal changes', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const card = findCard(fixture.nativeElement, 'Read without tracking');
    const buttons = card.querySelectorAll('button');

    buttons[0].click();
    fixture.detectChanges();
    expect(card.textContent).toContain('Alex / incidental count: 0');
    expect(card.textContent).toContain('Incidental counter: 1');

    buttons[1].click();
    fixture.detectChanges();
    expect(card.textContent).toContain('Sam / incidental count: 1');
  });

  it('updates linked selections and converts RxJS emissions to signals', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const deliveryCard = findCard(root, 'Dependent state');
    deliveryCard.querySelectorAll('button')[1].click();
    fixture.detectChanges();
    expect(deliveryCard.textContent).toContain('Selected: Express');

    deliveryCard.querySelector('button.text-button')?.click();
    fixture.detectChanges();
    expect(deliveryCard.textContent).toContain('Selected: Email');

    const rxjsCard = findCard(root, 'Signals and RxJS');
    rxjsCard.querySelector('button')?.click();
    fixture.detectChanges();
    expect(rxjsCard.textContent).toContain('RxJS emission 1');
  });
});
