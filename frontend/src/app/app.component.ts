import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// IMPORTS DO PRIMENG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu'; // <-- NOVO
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // <-- NOVO
import { MenuItem, ConfirmationService } from 'primeng/api'; // <-- NOVO

// IMPORT DO FORMULÁRIO
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
    ButtonModule, CardModule, TagModule, ToolbarModule, AvatarModule, DropdownModule, InputTextModule, DialogModule,
    MenuModule, // <-- NOVO
    ConfirmDialogModule, // <-- NOVO
    PublicidadeFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService] // <-- Adiciona o serviço para o pop-up funcionar
})
export class AppComponent implements OnInit {
  
  title = 'frontend-app';
  publicidadesAtuais: Publicidade[] = [];
  outrasPublicidades: Publicidade[] = [];
  estados: Estado[] = [];
  filtroEstado: Estado | null = null;
  filtroTermo: string = '';
  displayDialog: boolean = false;
  private apiUrl = 'http://localhost:8000/api';

  // Itens do menu de ações
  items: MenuItem[] = [];

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService // Injeta o serviço
  ) {}

  ngOnInit() {
    this.buscarPublicidades();
    this.buscarEstados();

    // Define os itens que aparecerão no menu
    this.items = [
        { 
          label: 'Editar', 
          icon: 'pi pi-fw pi-pencil', 
          command: () => {
              // A lógica para abrir o formulário de edição virá aqui
              console.log('Clicou em Editar');
          }
        },
        { 
          label: 'Encerrar', 
          icon: 'pi pi-fw pi-times-circle', 
          command: () => {
              this.confirmarEncerramento();
          }
        }
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

  abrirDialogNovaPublicidade() {
    this.displayDialog = true;
  }

  // Método que abre o pop-up de confirmação
  confirmarEncerramento() {
    this.confirmationService.confirm({
        message: 'Tem certeza que deseja encerrar esta publicidade?',
        header: 'Confirmação de Encerramento',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sim, encerrar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
            console.log('Confirmou o encerramento!');
            // A lógica real para chamar a API de encerramento virá aqui
        }
    });
  }
}