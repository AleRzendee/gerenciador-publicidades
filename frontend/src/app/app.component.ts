import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core'; // Adiciona PLATFORM_ID e Inject
import { isPlatformBrowser, CommonModule, DatePipe } from '@angular/common'; // Adiciona isPlatformBrowser
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';

// Módulos do PrimeNG
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
import { ToastModule } from 'primeng/toast';

// Componente do Formulário
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
    MenuModule, ConfirmDialogModule, ToastModule,
    PublicidadeFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService, MessageService]
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
  items: MenuItem[] = [];
  publicidadeSelecionada: Publicidade | null = null;
  publicidadeParaEditar: Publicidade | null = null;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object // Injeta o token para saber o ambiente
  ) {}

  ngOnInit() {
    // ESTA É A CORREÇÃO: SÓ BUSCA OS DADOS SE ESTIVER NO NAVEGADOR
    if (isPlatformBrowser(this.platformId)) {
      this.buscarPublicidades();
      this.buscarEstados();
    }
    
    this.items = [
        { label: 'Editar', icon: 'pi pi-fw pi-pencil', command: () => this.editarPublicidade() },
        { label: 'Encerrar', icon: 'pi pi-fw pi-times-circle', command: () => this.confirmarEncerramento() }
    ];
  }

  abrirMenuAcoes(menu: any, event: Event, publicidade: Publicidade) {
    this.publicidadeSelecionada = publicidade;
    menu.toggle(event);
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
    this.publicidadeParaEditar = null;
    this.displayDialog = true;
  }

  editarPublicidade() {
    if (!this.publicidadeSelecionada) return;
    this.publicidadeParaEditar = this.publicidadeSelecionada;
    this.displayDialog = true;
  }
  
  fecharDialog() {
    this.displayDialog = false;
    this.publicidadeParaEditar = null;
  }

  confirmarEncerramento() {
    if (!this.publicidadeSelecionada) return;
    this.confirmationService.confirm({
        message: `Tem certeza que deseja encerrar a publicidade "${this.publicidadeSelecionada.titulo}"?`,
        header: 'Confirmação de Encerramento',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sim, encerrar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.http.patch(`${this.apiUrl}/publicidades/${this.publicidadeSelecionada?.id}/encerrar`, {}).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Publicidade encerrada!' });
              this.buscarPublicidades();
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível encerrar a publicidade.' });
            }
          });
        }
    });
  }
}