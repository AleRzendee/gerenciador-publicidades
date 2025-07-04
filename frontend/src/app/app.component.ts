import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// IMPORTS DO PRIMENG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar'; // <-- Novo
import { AvatarModule } from 'primeng/avatar';   // <-- Novo

// Interface para a Publicidade
interface Publicidade {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  dt_fim: string;
  status: 'ativa' | 'encerrada';
  estados: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // Módulos PrimeNG
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    ToolbarModule, // <-- Novo
    AvatarModule,  // <-- Novo
    DatePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'frontend-app';
  publicidades: Publicidade[] = [];
  
  private apiUrl = 'http://localhost:8000/api/publicidades';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Publicidade[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Publicidades recebidas!', data);
        this.publicidades = data;
      },
      error: (err) => console.error('Falha ao buscar publicidades!', err)
    });
  }
}