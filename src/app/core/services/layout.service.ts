import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public isSidebarExpanded = signal<boolean>(false);

  public toggleSidebar(): void {
    this.isSidebarExpanded.set(!this.isSidebarExpanded());
  }
}