import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  protected readonly productName = 'Everyday Backpack';
  protected readonly unitPrice = 49.99;
  protected readonly maxQuantity = 5;

  // creating first signals for application how they declare the state of the application 
  // signals are reactive primitives that allow you to create reactive state in your application
  // signals are similar to observables but they are more lightweight and easier to use
  // signals are also more performant than observables because they do not have the overhead of subscriptions and unsubscriptions
  // signals are also more predictable than observables because they do not have the concept of time and they do not have the concept of completion
  // signals are also more composable than observables because they can be combined and transformed using simple functions
  // signals are also more testable than observables because they can be easily mocked and tested in isolation
  // computeds are derived signals that allow you to create reactive state that depends on other signals
  protected readonly quantity = signal(1);
  protected readonly subtotal = computed(()=>this.quantity()* this.unitPrice);
  protected readonly canDecrease = computed(()=>this.quantity()>1);
  protected readonly canIncrease = computed(()=>this.quantity()<this.maxQuantity);
  
  protected decreaseQuantity(): void {
    this.quantity.update((current) => Math.max(current - 1, 1));
  }

  protected increaseQuantity(): void {
    this.quantity.update((current) => Math.min(current + 1, this.maxQuantity));
  }

  protected resetQuantity(): void {
    this.quantity.set(1);
  }
}
