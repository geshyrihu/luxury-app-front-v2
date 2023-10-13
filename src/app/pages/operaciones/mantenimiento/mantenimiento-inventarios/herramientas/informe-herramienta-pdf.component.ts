import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { CustomerIdService } from 'src/app/services/common-services';
import { ReporteHerramientasPdfService } from 'src/app/services/reporte-herramientas-pdf.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-informe-herramienta-pdf',
  templateUrl: './informe-herramienta-pdf.component.html',
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe],
})
export default class InformeHerramientaPdfComponent implements OnInit {
  public reporteHerramientasPdfService = inject(ReporteHerramientasPdfService);
  public customerIdService = inject(CustomerIdService);
  data: any[] = [];
  base_urlImg = '';

  ngOnInit(): void {
    this.urlImg();
    this.data = this.reporteHerramientasPdfService.getData();
  }
  urlImg(): void {
    this.base_urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/tools/`;
  }
}
