import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

// Imports do PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-publicidade-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    InputTextareaModule, MultiSelectModule, CalendarModule, FileUploadModule, ToastModule
  ],
  templateUrl: './publicidade-form.component.html',
  styleUrl: './publicidade-form.component.css',
  providers: [MessageService]
})
export class PublicidadeFormComponent implements OnInit, OnChanges {
  @Input() publicidade: any | null = null;
  @Output() formSucesso = new EventEmitter<void>();
  @Output() formCancelar = new EventEmitter<void>();

  formPublicidade: FormGroup;
  estados: any[] = [];
  arquivoSelecionado: File | null = null;
  isEditMode: boolean = false;
  imagemExistente: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.formPublicidade = this.fb.group({
      estados: [null, [Validators.required]],
      titulo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      titulo_botao_link: ['', [Validators.required]],
      botao_link: ['', [Validators.required]],
      dt_inicio: [null, [Validators.required]],
      dt_fim: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8000/api/estados').subscribe(data => {
      this.estados = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formPublicidade.reset();
    this.arquivoSelecionado = null;
    this.imagemExistente = null;
    
    if (this.publicidade) {
      this.isEditMode = true;
      this.http.get<any>(`http://localhost:8000/api/publicidades/${this.publicidade.id}`).subscribe(data => {
        this.imagemExistente = data.imagem ? `http://localhost:8000/${data.imagem}` : null;
        this.formPublicidade.patchValue({
          ...data,
          estados: data.estados_obj,
          dt_inicio: new Date(data.dt_inicio),
          dt_fim: new Date(data.dt_fim)
        });
      });
    } else {
      this.isEditMode = false;
    }
  }

  onFileSelect(event: any) { this.arquivoSelecionado = event.files[0]; }

  // Método onFileRemove corrigido (não espera o argumento $event)
  onFileRemove() { 
    this.arquivoSelecionado = null;
  }

  onClear() { this.arquivoSelecionado = null; }
  
  cancelar() { this.formCancelar.emit(); }

  salvar() {
    if (this.formPublicidade.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }
    if (!this.isEditMode && !this.arquivoSelecionado) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, selecione uma imagem.' });
      return;
    }

    const formData = new FormData();
    const formValue = this.formPublicidade.value;
    
    formData.append('titulo', formValue.titulo);
    formData.append('descricao', formValue.descricao);
    formData.append('titulo_botao_link', formValue.titulo_botao_link);
    formData.append('botao_link', formValue.botao_link); 
    formData.append('dt_inicio', new Date(formValue.dt_inicio).toISOString().slice(0, 10));
    formData.append('dt_fim', new Date(formValue.dt_fim).toISOString().slice(0, 10));
    formData.append('estados', formValue.estados.map((e: any) => e.id).join(','));
    if (this.arquivoSelecionado) {
      formData.append('imagem', this.arquivoSelecionado);
    }
    
    const apiUrl = this.isEditMode 
      ? `http://localhost:8000/api/publicidades/${this.publicidade.id}`
      : 'http://localhost:8000/api/publicidades';

    this.http.post(apiUrl, formData).subscribe({
      next: (response) => {
        const detail = this.isEditMode ? 'Publicidade atualizada com sucesso!' : 'Publicidade criada com sucesso!';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail });
        this.formSucesso.emit();
      },
      error: (error) => {
        console.error('Erro:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar a publicidade.' });
      }
    });
  }
}