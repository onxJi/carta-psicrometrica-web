import { NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
//se importa acordion
import { AccordionModule } from 'primeng/accordion';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { MenubarModule } from 'primeng/menubar';
@NgModule({
    declarations: [],
    imports: [],
    exports: [
        TableModule,
        ButtonModule,
        DynamicDialogModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule,
        InputTextModule,
        FileUploadModule,
        ProgressSpinnerModule,
        MessageModule,
        MessagesModule,
        AutoCompleteModule,
        DialogModule,
        ConfirmDialogModule,
        InputTextareaModule,
        TabViewModule,
        BreadcrumbModule,
        RadioButtonModule,
        CheckboxModule,
        BreadcrumbModule,
        CardModule,
        AccordionModule,
        InputSwitchModule,
        TriStateCheckboxModule,
        DividerModule,
        ToastModule,
        SelectButtonModule,
        FloatLabelModule,
        PanelModule,
        ChartModule,
        MenubarModule
    ]
})
export class PrimeNgExportModule {
}