import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNameOnly]'
})
export class NameOnlyDirective {

  // Allow dot and space optionally
  @Input() allowDot: boolean = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInputChange(): void {
    let value = this.el.nativeElement.value;

    // Regex based on configuration
    const regex = this.allowDot
      ? /[^a-zA-Z.\s]/g
      : /[^a-zA-Z\s]/g;

    // Remove invalid characters
    value = value.replace(regex, '');

    // Remove multiple spaces
    value = value.replace(/\s{2,}/g, ' ');

    
    value = value
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
    
    this.el.nativeElement.value = value;
  }

  // Block invalid keypress
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const allowed = this.allowDot
      ? /^[a-zA-Z.\s]$/
      : /^[a-zA-Z\s]$/;

    if (!allowed.test(event.key)) {
      event.preventDefault();
    }
  }
}


