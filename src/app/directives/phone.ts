import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPhone]'
})
export class Phone {

  @Input() maxLength: number = 16;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // Allow only numbers
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    let input = this.el.nativeElement.value;

    // Remove non-numeric characters
    input = input.replace(/[^0-9]/g, '');

    // Enforce max length
    if (input.length > this.maxLength) {
      input = input.slice(0, this.maxLength);
    }

    this.el.nativeElement.value = input;
  }

  // Block non-numeric keypress
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}
