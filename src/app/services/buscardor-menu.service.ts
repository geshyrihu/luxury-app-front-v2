import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MenuItem } from 'src/app/shared/layouts/sidebar/menu.model';
import { SidebarService } from './sidebar.service';

@Injectable({
  providedIn: 'root',
})
export class BuscardorMenuService {
  private sidebarService = inject(SidebarService);

  menuSidebar: MenuItem[] = this.sidebarService.menu;
  mostrarFiltro: boolean = false;
  resultados$ = new Subject<MenuItem[]>();

  onFiltrar({ valor }: { valor: string }) {
    this.menuSidebar = [];
    if (valor == '') {
      this.mostrarFiltro = false;
      this.menuSidebar = [];
    } else {
      this.mostrarFiltro = true;
      this.sidebarService.menu.forEach((resp) => {
        if (resp.label.toLowerCase().includes(valor.toLowerCase())) {
          let item: MenuItem = {
            label: resp.label,
            link: resp.link,
            subItems: resp.subItems,
            visible: resp.visible,
            icon: resp.icon,
          };
          this.menuSidebar.push(item);
        }

        if (resp.subItems !== undefined) {
          resp.subItems.forEach((resp) => {
            if (resp.label.toLowerCase().includes(valor.toLowerCase())) {
              let item: MenuItem = {
                label: resp.label,
                link: resp.link,
                subItems: resp.subItems,
                visible: resp.visible,
                icon: resp.icon,
              };
              this.menuSidebar.push(item);
            }
            if (resp.subItems !== undefined) {
              resp.subItems.forEach((resp) => {
                if (resp.label.toLowerCase().includes(valor.toLowerCase())) {
                  let item: MenuItem = {
                    label: resp.label,
                    link: resp.link,
                    subItems: resp.subItems,
                    visible: resp.visible,
                    icon: resp.icon,
                  };
                  this.menuSidebar.push(item);
                }
              });
            }
          });
        }
      });
    }
    this.resultados$.next(this.menuSidebar);
  }

  getResultados$(): Observable<MenuItem[]> {
    return this.resultados$.asObservable();
  }
  onReturnMenu() {
    return this.menuSidebar;
  }
  onReturStateFiltro() {
    return this.mostrarFiltro;
  }
}
