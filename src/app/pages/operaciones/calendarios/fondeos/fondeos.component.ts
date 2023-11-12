import { Component, inject } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewPdfService } from 'src/app/core/services/view-pdf.service';

@Component({
  selector: 'app-fondeos',
  templateUrl: './fondeos.component.html',
  standalone: true,
  imports: [PdfViewerModule],
})
export default class FondeosComponent {
  public viewPdfService = inject(ViewPdfService);
}
