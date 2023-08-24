import { Component, OnInit, inject } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewPdfService } from 'src/app/services/view-pdf.service';
@Component({
  selector: 'app-visor-pdf-contrato-poliza',
  templateUrl: './visor-pdf-contrato-poliza.component.html',
  standalone: true,
  imports: [PdfViewerModule],
})
export default class VisorPdfContratoPolizaComponent implements OnInit {
  public viewPdfService = inject(ViewPdfService);
  urlDocument: string = '';
  nameDocument: string = '';
  id: any;

  ngOnInit(): void {
    this.urlDocument = '';
    this.urlDocument = this.viewPdfService.getNameDocument();
  }
}
