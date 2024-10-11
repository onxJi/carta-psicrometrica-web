import { Component, HostListener, input } from '@angular/core';
import { PrimeNgExportModule } from '../primengExportModule/PrimeNgExportModule.module';

export interface IconType {
  icon?: string;
  border?: string; 
}



@Component({
  selector: 'app-subir-archivos',
  standalone: true,
  imports: [PrimeNgExportModule],
  templateUrl: './subir-archivos.component.html',
  styleUrl: './subir-archivos.component.css'
})
export class SubirArchivosComponent {

  
  uploadedFile: File | null = null;
  color = input<IconType>({ icon: '#007bff'});
  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.add('dragover');
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  openFileDialog() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList) {
    this.uploadedFile = files[0];
    console.log('File uploaded:', this.uploadedFile);
  }

  removeFile() {
    this.uploadedFile = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.value = '';
  }
}
