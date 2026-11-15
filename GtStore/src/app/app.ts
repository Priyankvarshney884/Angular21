import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  assertNotInReactiveContext,
  computed,
  effect,
  isSignal,
  isWritableSignal,
  linkedSignal,
  resource,
  signal,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  protected readonly productName = 'Everyday Backpack';
  protected readonly unitPrice = 49.99;
  protected readonly maxQuantity = 5;

  protected readonly quantity = signal(1);
  protected readonly subtotal = computed(() => this.quantity() * this.unitPrice);
  protected readonly canDecrease = computed(() => this.quantity() > 1);
  protected readonly canIncrease = computed(() => this.quantity() < this.maxQuantity);

  protected readonly showSubtotal = signal(true);
  protected readonly cartSummary = computed(() =>
    this.showSubtotal() ? `Subtotal: $${this.subtotal().toFixed(2)}` : 'Subtotal hidden',
  );

  protected readonly trackedName = signal('Alex');
  protected readonly incidentalCount = signal(0);
  protected readonly untrackedSummary = computed(
    () => `${this.trackedName()} / incidental count: ${untracked(this.incidentalCount)}`,
  );

  protected readonly theme = signal('Light');
  protected readonly asyncRun = signal(0);
  protected readonly asyncResult = signal(
    'Run the async effect, then change the theme to see that the later read is not tracked.',
  );

  protected readonly deliveryOptions = signal(['Standard', 'Express', 'Pickup']);
  protected readonly selectedDelivery = linkedSignal(() => this.deliveryOptions()[0]);

  protected readonly resourceProduct = signal('Backpack');
  protected readonly productResource = resource({
    params: () => ({ product: this.resourceProduct() }),
    loader: async ({ params, abortSignal }) => {
      await new Promise<void>((resolve, reject) => {
        const abort = () => {
          clearTimeout(timeout);
          reject(abortSignal.reason);
        };
        const timeout = setTimeout(() => {
          abortSignal.removeEventListener('abort', abort);
          resolve();
        }, 300);
        abortSignal.addEventListener('abort', abort, { once: true });

        if (abortSignal.aborted) {
          abort();
        }
      });

      return `Loaded details for ${params.product}`;
    },
  });

  protected readonly equalityValue = signal('Ready', {
    equal: (previous, next) => previous.toLowerCase() === next.toLowerCase(),
  });
  protected readonly equalityAttempts = signal(0);

  protected readonly typeChecks = {
    quantityIsSignal: isSignal(this.quantity),
    quantityIsWritable: isWritableSignal(this.quantity),
    subtotalIsSignal: isSignal(this.subtotal),
    subtotalIsWritable: isWritableSignal(this.subtotal),
  };

  private readonly updates = new Subject<string>();
  protected readonly observableMessage = toSignal(this.updates, {
    initialValue: 'No RxJS values emitted yet.',
  });
  protected readonly quantityObservable = toObservable(this.quantity);

  protected readonly assertionMessage = signal('The assertion has not been run yet.');
  protected readonly debugMessage = signal('Signal values have not been logged yet.');
  protected readonly rxjsEmissionCount = signal(0);

  constructor() {
    effect(() => {
      console.info(`[signals-poc] cart quantity: ${this.quantity()}`);
    });

    effect((onCleanup) => {
      const run = this.asyncRun();
      if (run === 0) {
        return;
      }

      let active = true;
      onCleanup(() => {
        active = false;
      });

      Promise.resolve().then(() => {
        if (active) {
          this.asyncResult.set(
            `Async run ${run} read the theme as "${this.theme()}" after the async boundary.`,
          );
        }
      });
    });
  }

  protected decreaseQuantity(): void {
    this.quantity.update((current) => Math.max(current - 1, 1));
  }

  protected increaseQuantity(): void {
    this.quantity.update((current) => Math.min(current + 1, this.maxQuantity));
  }

  protected resetQuantity(): void {
    this.quantity.set(1);
  }

  protected toggleSubtotal(): void {
    this.showSubtotal.update((visible) => !visible);
  }

  protected changeTrackedName(): void {
    this.trackedName.update((name) => (name === 'Alex' ? 'Sam' : 'Alex'));
  }

  protected incrementIncidentalCount(): void {
    this.incidentalCount.update((count) => count + 1);
  }

  protected toggleTheme(): void {
    this.theme.update((current) => (current === 'Light' ? 'Dark' : 'Light'));
  }

  protected runAsyncEffect(): void {
    this.asyncRun.update((run) => run + 1);
  }

  protected selectDelivery(option: string): void {
    this.selectedDelivery.set(option);
  }

  protected replaceDeliveryOptions(): void {
    this.deliveryOptions.set(['Email', 'Courier', 'In-store pickup']);
  }

  protected changeResourceProduct(): void {
    this.resourceProduct.update((product) =>
      product === 'Backpack' ? 'Water bottle' : 'Backpack',
    );
  }

  protected setEquivalentValue(): void {
    this.equalityAttempts.update((attempts) => attempts + 1);
    this.equalityValue.set('READY');
  }

  protected emitRxjsValue(): void {
    const emission = this.rxjsEmissionCount() + 1;
    this.rxjsEmissionCount.set(emission);
    this.updates.next(`RxJS emission ${emission}`);
  }

  protected assertImperativeContext(): void {
    assertNotInReactiveContext(this.assertImperativeContext);
    this.assertionMessage.set('Passed: this click handler is outside a reactive context.');
  }

  protected logSignalState(): void {
    console.table({
      quantity: this.quantity(),
      subtotal: this.subtotal(),
      selectedDelivery: this.selectedDelivery(),
      theme: this.theme(),
    });
    this.debugMessage.set('Logged current values to the browser console.');
  }
}
