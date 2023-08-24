import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InfoEmployeeAuthDto } from 'src/app/interfaces/auth/user-token.interface';
import { AuthService } from 'src/app/services/auth.service';
import { BuscardorMenuService } from 'src/app/services/buscardor-menu.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { ProfielServiceService } from 'src/app/services/profiel-service.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    NgbTooltip,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export class TopbarComponent implements OnInit {
  private buscadorMenuService = inject(BuscardorMenuService);
  private customerIdService = inject(CustomerIdService);
  private router = inject(Router);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public profielServiceService = inject(ProfielServiceService);
  public toastService = inject(ToastService);
  private location = inject(Location);

  @Output()
  mobileMenuButtonClicked = new EventEmitter();

  valueset: any;
  dataInfo: InfoEmployeeAuthDto;
  customerId = this.customerIdService.customerId;
  cb_customer: any[] = [];
  imagenPerfilUrl = '';
  ref: DynamicDialogRef;

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `CustomersAcceso/${this.authService.infoUserAuthDto.applicationUserId}`
      )
      .subscribe((resp) => {
        this.cb_customer = resp;
      });
  }

  onSearch(event: any) {
    this.buscadorMenuService.onFiltrar({ valor: event.target.value });
  }
  selectCustomer(customerId: number) {
    this.customerIdService.setCustomerId(customerId);
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.dataInfo = this.authService.userTokenDto.infoEmployeeDto;
    this.imagenPerfilUrl =
      environment.base_urlImg +
      'Administration/accounts/' +
      this.dataInfo.photoPath;
    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => (this.imagenPerfilUrl = nuevaImagenUrl.imagenUrl)
    );
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    const currentUrl = this.router.url;
    localStorage.setItem('currentUrl', currentUrl);
    this.router.navigate(['/auth/login']);
  }

  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
  }
}
