import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SidebarService } from 'src/app/services/sidebar.service';
import { MenuItem } from '../sidebar/menu.model';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class ModalSearchComponent implements OnInit {
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  public ref = inject(DynamicDialogRef);

  selectedButtonIndex: number | null = null;

  menu: MenuItem[] = this.sidebarService.onLoadMenu;
  menuFilter: { name: string; link: string }[] = [];
  private nameLinkList: { name: string; link: string }[] = [];

  ngOnInit() {
    this.mapMenu(this.menu);
    console.log('🚀 ~ this.nameLinkList:', this.nameLinkList);
  }

  private mapMenu(menuItems: MenuItem[]) {
    for (const item of menuItems) {
      if (item.visible && item.name && item.link) {
        this.nameLinkList.push({ name: item.name, link: item.link });
      }
      if (item.subItems) {
        this.mapMenu(item.subItems);
      }
    }
  }

  onSearch(value: string) {
    this.selectedButtonIndex = -1; // Reinicia el índice cuando se realiza una búsqueda
    const searchText = value.toLowerCase();
    this.menuFilter = this.nameLinkList.filter((item) =>
      item.name.toLowerCase().includes(searchText)
    );
  }
  onNavigate(link: string) {
    this.router.navigate([link]);
    this.ref.close(true);
  }

  navigateMenu(direction: 'up' | 'down', event: KeyboardEvent) {
    console.log('🚀 ~ direction:', direction);
    if (this.menuFilter.length === 0) return;

    // Quitar el enfoque del input
    const inputElement = event.target as HTMLInputElement;
    inputElement.blur();

    if (direction === 'up') {
      this.selectedButtonIndex =
        (this.selectedButtonIndex - 1 + this.menuFilter.length) %
        this.menuFilter.length;
    } else if (direction === 'down') {
      this.selectedButtonIndex =
        (this.selectedButtonIndex + 1) % this.menuFilter.length;
    }

    // Prevenir el comportamiento predeterminado de la tecla hacia abajo
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
    }
  }
}
