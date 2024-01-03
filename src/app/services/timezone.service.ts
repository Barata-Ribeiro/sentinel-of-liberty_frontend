import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TimezoneService {
  constructor() {}

  convertToUserTimezone(dateString: string): Date {
    const utcDate = new Date(dateString);
    const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
    return new Date(utcDate.getTime() - userTimezoneOffset);
  }
}
