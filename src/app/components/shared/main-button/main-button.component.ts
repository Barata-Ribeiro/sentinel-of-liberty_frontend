import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-main-button",
  standalone: true,
  imports: [],
  templateUrl: "./main-button.component.html",
  styleUrl: "./main-button.component.css",
})
export class MainButtonComponent {
  @Input() url: string = "";
  @Input() buttonText: string = "";
  @Input() tailwindClasses: string = "";
  @Input() ariaLabel: string = this.buttonText;
  @Output() onClick = new EventEmitter<MouseEvent>();

  onClickButton(event: MouseEvent | undefined) {
    this.onClick.emit(event);
  }
}
