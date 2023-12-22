import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-burger-menu",
  standalone: true,
  template: `
    <button
      class="group flex h-12 w-12 flex-col items-center justify-center rounded"
      (click)="toggleMenu()">
      <div [className]="getLineClasses(1)"></div>
      <div [className]="getLineClasses(2)"></div>
      <div [className]="getLineClasses(3)"></div>
    </button>
  `,
  styles: [
    `
      .line {
        height: 0.25rem;
        width: 1.5rem;
        margin: 0.25rem 0;
        border-radius: 5rem;
        background: hsl(40 37% 40%);
        transition: all 300ms ease;
      }
      .dark .line {
        background: hsl(48 33% 60%);
      }
    `,
  ],
})
export class BurgerMenuComponent {
  @Output() isOpenChange = new EventEmitter<boolean>();
  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  getLineClasses(lineNumber: number): string {
    const baseClass = "line";
    if (lineNumber === 1) {
      return this.isOpen
        ? `${baseClass} rotate-45 translate-y-3 opacity-50 group-hover:opacity-100`
        : `${baseClass} opacity-50 group-hover:opacity-100`;
    } else if (lineNumber === 2) {
      return this.isOpen
        ? `${baseClass} opacity-0`
        : `${baseClass} opacity-50 group-hover:opacity-100`;
    } else if (lineNumber === 3) {
      return this.isOpen
        ? `${baseClass} -rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100`
        : `${baseClass} opacity-50 group-hover:opacity-100`;
    }
    return baseClass;
  }
}
