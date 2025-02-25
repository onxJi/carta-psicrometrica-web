import { Component } from "@angular/core";
import { PrimeNgExportModule } from "../../shared/primengExportModule/PrimeNgExportModule.module";


@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [PrimeNgExportModule],
    templateUrl: './contact-page.component.html',
    styleUrl: './contact-page.component.css'
})
export default class ContactPageComponent {

}