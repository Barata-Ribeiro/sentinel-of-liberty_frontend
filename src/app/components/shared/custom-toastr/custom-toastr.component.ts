import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Toast } from "ngx-toastr";

@Component({
  selector: "[app-custom-toastr]",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./custom-toastr.component.html",
  styleUrl: "./custom-toastr.component.css",
  animations: [
    trigger("flyInOut", [
      state(
        "inactive",
        style({
          opacity: 0,
        })
      ),
      transition(
        "inactive => active",
        animate(
          "400ms ease-out",
          keyframes([
            style({
              transform: "translate3d(100%, 0, 0) skewX(-30deg)",
              opacity: 0,
            }),
            style({
              transform: "skewX(20deg)",
              opacity: 1,
            }),
            style({
              transform: "skewX(-5deg)",
              opacity: 1,
            }),
            style({
              transform: "none",
              opacity: 1,
            }),
          ])
        )
      ),
      transition(
        "active => removed",
        animate(
          "400ms ease-out",
          keyframes([
            style({
              opacity: 1,
            }),
            style({
              transform: "translate3d(100%, 0, 0) skewX(30deg)",
              opacity: 0,
            }),
          ])
        )
      ),
    ]),
  ],
  preserveWhitespaces: false,
})
export class CustomToastrComponent extends Toast {
  /*

  // EXAMPLE OF USAGE
  this.toastr.show("YOUR MESSAGE", "SUCCESS", {
      toastComponent: CustomToastrComponent,
      toastClass:
        "shadow-[5px_5px_0px_0px_rgba(217,249,157)] max-w-sm rounded-lg border border-lime-200 bg-lime-100 dark:border-lime-900 dark:bg-lime-800/10 dark:text-lime-500",
      titleClass: "text-lime-800 font-bold text-lg",
      messageClass: "text-lime-800 font-medium text-normal",
      disableTimeOut: true,
    });

  */
}
