import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

// IMPORTS DO PRIMENG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown'; 
import { InputTextModule } from 'primeng/inputtext';

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
  imports: [ CommonModule, RouterOutlet, FormsModule, DatePipe, TableModule, ButtonModule, CardModule, TagModule, ToolbarModule, AvatarModule, DropdownModule, InputTextModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  publicidadesAtuais: Publicidade[] = [];
  outrasPublicidades: Publicidade[] = [];
  estados: Estado[] = [];

  filtroEstado: Estado | null = null;
  filtroTermo: string = '';
  
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.buscarPublicidades();
    this.buscarEstados();
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
        // Separa as publicidades em duas listas
        this.publicidadesAtuais = data.filter(p => p.categoria_vigencia === 'atual');
        this.outrasPublicidades = data.filter(p => p.categoria_vigencia !== 'atual');
      },
      error: (err) => console.error('Falha ao buscar publicidades!', err)
    });
  }
}