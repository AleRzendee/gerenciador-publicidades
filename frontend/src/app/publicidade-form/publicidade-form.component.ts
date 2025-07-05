import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Imports do PrimeNG para o formulário
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
export class PublicidadeFormComponent implements OnInit {
  @Output() formSucesso = new EventEmitter<void>();
  @Output() formCancelar = new EventEmitter<void>();

  formPublicidade: FormGroup;
  estados: any[] = [];
  arquivoSelecionado: File | null = null;

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
      link_botao: ['', [Validators.required]],
      dt_inicio: ['', [Validators.required]],
      dt_fim: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8000/api/estados').subscribe(data => {
      this.estados = data;
    });
  }

  // Evento chamado quando um arquivo é selecionado
  onFileSelect(event: any) {
    this.arquivoSelecionado = event.files[0];
    console.log('Arquivo selecionado:', this.arquivoSelecionado);
  }

  // Evento chamado quando a lista toda é limpa
  onClear() {
    this.arquivoSelecionado = null;
    console.log('Seleção de arquivo limpa.');
  }
  
  // Evento chamado quando um arquivo específico é removido
  onFileRemove(event: any) {
    // Se o arquivo removido for o que estava selecionado
    if(this.arquivoSelecionado && this.arquivoSelecionado.name === event.file.name) {
      this.arquivoSelecionado = null;
      console.log('Arquivo removido:', event.file.name);
    }
  }

  cancelar() {
    this.formCancelar.emit();
  }

  salvar() {
    if (this.formPublicidade.invalid || !this.arquivoSelecionado) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha todos os campos e selecione uma imagem.' });
      return;
    }

    const formData = new FormData();
    const formValue = this.formPublicidade.value;

    formData.append('titulo', formValue.titulo);
    formData.append('descricao', formValue.descricao);
    formData.append('titulo_botao_link', formValue.titulo_botao_link);
    formData.append('botao_link', formValue.link_botao);
    formData.append('dt_inicio', new Date(formValue.dt_inicio).toISOString().slice(0, 10));
    formData.append('dt_fim', new Date(formValue.dt_fim).toISOString().slice(0, 10));
    formData.append('estados', formValue.estados.map((e: any) => e.id).join(','));
    formData.append('imagem', this.arquivoSelecionado);

    this.http.post('http://localhost:8000/api/publicidades', formData).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Publicidade criada com sucesso!' });
        this.formSucesso.emit();
      },
      error: (error) => {
        console.error('Erro ao criar publicidade', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível criar a publicidade.' });
      }
    });
  }
}