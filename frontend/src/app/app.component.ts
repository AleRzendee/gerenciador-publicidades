import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//* IMPORTS DO PRIMENG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

//* IMPORT DO NOVO COMPONENTE DE FORMULÁRIO
import { PublicidadeFormComponent } from './publicidade-form/publicidade-form.component';

// Interfaces
interface Publicidade {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  dt_inicio: string;
  dt_fim: string;
  status: 'ativa' | 'encerrada';
  estados: string;
  categoria_vigencia: 'atual' | 'futura' | 'passada' | 'encerrada';
}

interface Estado {
  id: number | null;
  descricao: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, FormsModule, DatePipe,
    // Módulos PrimeNG
    ButtonModule, CardModule, TagModule, ToolbarModule, AvatarModule, DropdownModule, InputTextModule,
    DialogModule, MenuModule,
    ConfirmDialogModule,
    PublicidadeFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService]
})


export class AppComponent implements OnInit {

  title = 'frontend-app';
  publicidadesAtuais: Publicidade[] = [];
  outrasPublicidades: Publicidade[] = [];
  estados: Estado[] = [];
  filtroEstado: Estado | null = null;
  filtroTermo: string = '';
  private apiUrl = 'http://localhost:8000/api';

  displayDialog: boolean = false;

  items: MenuItem[] = [];

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.buscarPublicidades();
    this.buscarEstados();
    this.items = [
        { label: 'Editar', icon: 'pi pi-pencil', command: () => {
            // Lógica para editar virá aqui
            console.log('Clicou em Editar');
        }},
        { label: 'Encerrar', icon: 'pi pi-times-circle', command: () => {
            // Lógica para encerrar virá aqui
            console.log('Clicou em Encerrar');
            this.confirmarEncerramento();
        }}
    ];
  }

  buscarEstados() {
    this.http.get<Estado[]>(`${this.apiUrl}/estados`).subscribe(data => {
      this.estados = [{ descricao: 'Visualizar todos os Estados', id: null }, ...data];
    });
  }

  buscarPublicidades() {
    let params = new HttpParams();
    if (this.filtroEstado && this.filtroEstado.id) {
      params = params.append('estado_id', this.filtroEstado.id.toString());
    }
    if (this.filtroTermo) {
      params = params.append('q', this.filtroTermo);
    }
    this.http.get<Publicidade[]>(`${this.apiUrl}/publicidades`, { params }).subscribe({
      next: (data) => {
        this.publicidadesAtuais = data.filter(p => p.categoria_vigencia === 'atual');
        this.outrasPublicidades = data.filter(p => p.categoria_vigencia !== 'atual');
      },
      error: (err) => console.error('Falha ao buscar publicidades!', err)
    });
  }

  // Método para abrir o dialog
  abrirDialogNovaPublicidade() {
    this.displayDialog = true;
  }

  confirmarEncerramento() {
    this.confirmationService.confirm({
        message: 'Tem certeza que deseja encerrar esta publicidade?',
        header: 'Confirmação de Encerramento',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sim, encerrar',
        rejectLabel: 'Cancelar',
        accept: () => {
            console.log('Confirmou o encerramento!');
            // A lógica para chamar a API de encerramento virá aqui
        }
    });
  }
}