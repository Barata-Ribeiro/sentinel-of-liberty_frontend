import { animate, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-delete-account-modal",
  standalone: true,
  imports: [],
  templateUrl: "./delete-account-modal.component.html",
  styleUrl: "./delete-account-modal.component.css",
  animations: [
    trigger("backdropAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("300ms ease-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [animate("200ms ease-in", style({ opacity: 0 }))]),
    ]),
    trigger("modalAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(4px) scale(0.95)" }),
        animate(
          "300ms ease-out",
          style({ opacity: 1, transform: "translateY(0) scale(1)" })
        ),
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ opacity: 0, transform: "translateY(4px) scale(0.95)" })
        ),
      ]),
    ]),
  ],
})
export class DeleteAccountModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() deactivate = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onDeactivate() {
    this.deactivate.emit();
    this.onClose();
  }
}
