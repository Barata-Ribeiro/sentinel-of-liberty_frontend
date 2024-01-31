import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { User } from "../../@types/appTypes";

@Component({
  selector: "app-account-details-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./account-details-modal.component.html",
  styleUrl: "./account-details-modal.component.css",
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
export class AccountDetailsModalComponent {
  @Input() userData: User | null = null;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
