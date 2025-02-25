import { Component, effect, HostListener, input } from '@angular/core';
import { PrimeNgExportModule } from '../primengExportModule/PrimeNgExportModule.module';
import { style } from '@angular/animations';
import { CommonModule } from '@angular/common';

export interface IconType {
  icon?: string;
  border?: string;
}

export interface ButtonType {
  text: string;
  style?: { [key: string]: string };
  class?: string | string[];
}


@Component({
  selector: 'app-subir-archivos',
  standalone: true,
  imports: [PrimeNgExportModule, CommonModule],
  templateUrl: './subir-archivos.component.html',
  styleUrl: './subir-archivos.component.css',
})
export class SubirArchivosComponent {


  uploadedFile: File | null = null;
  color = input<IconType>({ icon: '#007bff' });
  public button = input<ButtonType>({ text: 'Subir archivo' });

  constructor() {

    effect(() => {
      console.log('File uploaded:', this.button());
    });
  }

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
