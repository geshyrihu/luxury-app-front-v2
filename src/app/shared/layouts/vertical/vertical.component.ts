import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { Dialog } from 'primeng/dialog';
import SidebarComponent from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent, RouterModule],
})

/**
 * Vertical Component
 */
export default class VerticalComponent implements OnInit, OnDestroy {
  @ViewChild('myDialog') myDialog: Dialog;
  private router = inject(Router);
  private bnIdle = inject(BnNgIdleService);

  // @HostListener('window:resize', ['$event'])
  isCondensed = false;

  // some fields to store our state so we can display it in the UI
  idleState = 'NOT_STARTED';
  countdown?: number = null;
  lastPing?: Date = null;

  ngOnInit(): void {
    document.body.setAttribute('data-layout', 'vertical');

    /**
     * Metodo despues de 15 minutos de inactividad, se va a cerrar sesión
     */
    // this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
    this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        const currentUrl = this.router.url;
        localStorage.setItem('currentUrl', currentUrl);
        this.myDialog.close(null);
        this.router.navigate(['/auth/login']);
      }
    });
  }
  ngOnDestroy(): void {
    this.bnIdle.stopTimer();
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
    const currentSIdebarSize = document.body.getAttribute('data-sidebar-size');
    if (window.screen.width >= 992) {
      if (currentSIdebarSize == null) {
        document.body.getAttribute('data-sidebar-size') == null ||
        document.body.getAttribute('data-sidebar-size') == 'lg'
          ? document.body.setAttribute('data-sidebar-size', 'sm')
          : document.body.setAttribute('data-sidebar-size', 'lg');
      } else if (currentSIdebarSize == 'md') {
        document.body.getAttribute('data-sidebar-size') == 'md'
          ? document.body.setAttribute('data-sidebar-size', 'sm')
          : document.body.setAttribute('data-sidebar-size', 'md');
      } else {
        document.body.getAttribute('data-sidebar-size') == 'sm'
          ? document.body.setAttribute('data-sidebar-size', 'lg')
          : document.body.setAttribute('data-sidebar-size', 'sm');
      }
    }
    this.isCondensed = !this.isCondensed;
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  onOcultarBarra() {
    if (window.innerWidth <= 992) {
      /**Aca la funcion que oculte el menu */
      this.onSettingsButtonClicked();
      this.onToggleMobileMenu();
    }
  }
}
