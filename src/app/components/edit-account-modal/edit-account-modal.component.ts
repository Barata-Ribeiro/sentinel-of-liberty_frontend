import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EditDataRequest } from "../../@types/appTypes";

@Component({
  selector: "app-edit-account-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./edit-account-modal.component.html",
  styleUrl: "./edit-account-modal.component.css",
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
export class EditAccountModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() requestEdit = new EventEmitter<EditDataRequest>();
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.editForm = this.formBuilder.group({
      displayName: [
        "",
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(3),
        ],
      ],
      biography: [
        "",
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.minLength(3),
        ],
      ],
    });
  }

  onClose() {
    this.close.emit();
  }

  onEditAccount() {
    const updateData: EditDataRequest = {};

    if (this.editForm.get("displayName")?.value)
      updateData.sol_username = this.editForm.get("displayName")?.value;

    if (this.editForm.get("biography")?.value)
      updateData.sol_biography = this.editForm.get("biography")?.value;

    if (Object.keys(updateData).length > 0) {
      this.requestEdit.emit(updateData);
      this.onClose();
    }
  }

  get displayNameError(): string {
    const control = this.editForm.get("displayName");

    if (control?.errors?.["minlength"]) return "Display Name is too short";
    if (control?.errors?.["maxlength"])
      return "Display Name cannot be more than 20 characters";

    return "";
  }

  get biographyError(): string {
    const control = this.editForm.get("biography");

    if (control?.errors?.["minlength"]) return "Biography is too short";
    if (control?.errors?.["maxlength"])
      return "Biography cannot be more than 150 characters";

    return "";
  }
}
